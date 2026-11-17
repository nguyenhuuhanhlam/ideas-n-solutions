/**
 * System prompt dạy Gemini vẽ mặt bằng theo đúng Building JSON của app.
 * Người dùng mô tả bằng tiếng Việt; model chỉ trả JSON (không giải thích).
 * Ví dụ trong prompt đã được kiểm chứng: đúng schema, cửa không chồng
 * nhau, cung quay không chạm nhau.
 */

/** Hướng dẫn hệ thống gửi kèm mọi yêu cầu tạo mặt bằng. */
export const FLOORPLAN_SYSTEM_PROMPT = `You are an architect drafting a floor plan. Output ONLY a JSON object matching the Building schema — no explanations, no markdown fences.

COORDINATE SYSTEM
- All coordinates and sizes are INTEGER millimetres.
- 2D plan, Y points DOWN (north = smaller y). Put the north-west corner of the house at (0,0), x grows east, y grows south.
- Exactly ONE level: id "l1", name "Tầng 1", elevation 0, height 3000.

WALLS
- A wall is a polyline: points[] with 2+ points. Two points = one straight segment; 3+ = a bent wall.
- Exterior walls: make ONE closed ring wall when possible (first point = last point), thickness 200.
- Interior walls: separate walls, thickness 100. Their endpoints should touch the ring or another wall.
- Walls may share endpoints to join. Prefer axis-aligned (horizontal/vertical) walls; no diagonals unless asked.
- Level height 3000.

OPENINGS (doors and windows)
- Each opening belongs to a wall (wallId) and is measured ALONG that wall's point chain starting at points[0], in mm.
- offset + width must be <= the wall's total chain length. Openings on the same wall must NOT overlap each other.
- Doors: width 800-900, height 2100, sillHeight 0. Windows: width 1000-1800, height 1200, sillHeight 900.
- Every room needs at least one door. The main entrance door must be on an exterior wall.
- flip chooses which side the door leaf swings to. For a wall running east (direction +x), flip=false opens the door toward the SOUTH side of the wall and flip=true toward the NORTH side. For a wall running south (direction +y), flip=false opens toward the WEST side, flip=true toward the EAST side. Choose flip so the leaf swings INTO the room the door serves.
- Door swings must not overlap each other: two doors near a corner must swing away from each other, or be at least 1500 mm apart.

DESIGN
- Keep rooms rectangular with realistic sizes: bedroom 9-15 m2, living room 15-25 m2, bathroom 3-5 m2, kitchen 8-12 m2. Corridors at least 900 wide.
- Keep the plan simple and buildable. Do not add rooms or features the user did not ask for.
- Check your arithmetic: every offset + width must fit its wall, and wall endpoints that should meet must share exact coordinates.

EXAMPLE — a 6000x4000 house with 2 rooms (study its exact numbers):
{"version":1,"levels":[{"id":"l1","name":"Tầng 1","elevation":0,"height":3000,"walls":[{"id":"w-outer","points":[{"x":0,"y":0},{"x":6000,"y":0},{"x":6000,"y":4000},{"x":0,"y":4000},{"x":0,"y":0}],"thickness":200},{"id":"w-part","points":[{"x":3000,"y":0},{"x":3000,"y":4000}],"thickness":100}],"openings":[{"id":"o-main","wallId":"w-outer","type":"door","offset":12000,"width":900,"height":2100,"sillHeight":0,"flip":false},{"id":"o-room","wallId":"w-part","type":"door","offset":1500,"width":800,"height":2100,"sillHeight":0,"flip":false},{"id":"o-win-n","wallId":"w-outer","type":"window","offset":1000,"width":1500,"height":1200,"sillHeight":900},{"id":"o-win-e","wallId":"w-outer","type":"window","offset":7000,"width":1200,"height":1200,"sillHeight":900}]}]}`;

/** Prompt người dùng cho lượt tạo đầu tiên (mô tả tiếng Việt của user). */
export function buildUserPrompt(description: string): string {
  return `Draw this floor plan as a Building JSON:\n\n${description.trim()}\n\nRespond with the JSON object only.`;
}

/** Prompt sửa lỗi: gửi lại mô tả + JSON lần trước + danh sách lỗi, bảo model chỉ sửa lỗi đó. */
export function buildRepairPrompt(
  description: string,
  previousJson: string,
  errors: string[],
): string {
  return (
    `Draw this floor plan as a Building JSON:\n\n${description.trim()}\n\n` +
    `Your previous output had these problems (fix ONLY these, keep everything else):\n` +
    errors.map((e) => `- ${e}`).join('\n') +
    `\n\nPrevious output:\n${previousJson}\n\nRespond with the corrected JSON object only.`
  );
}

/**
 * Tách JSON khỏi text model trả về: bỏ fence markdown ```json nếu có,
 * cắt từ dấu { đầu tiên tới dấu } cuối cùng. Trả nguyên text nếu không
 * tìm thấy ngoặc (JSON.parse phía trên sẽ báo lỗi rõ ràng).
 */
export function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return text.trim();
  return body.slice(start, end + 1);
}
