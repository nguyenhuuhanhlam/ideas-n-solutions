import { Handle, Position } from '@xyflow/react'
import { AGENTS, MEMBERS } from './data.js'

// Bố cục canvas (trái → phải): member → trợ lý → agent → cổng duyệt → workspace → nhóm.
// Quản lý ngồi trên cổng duyệt (đường leo thang / duyệt tay đi qua quản lý).
export const NODE_W = { member: 196, agent: 196, hub: 220, gate: 210, manager: 196, workspace: 220, team: 220, token: 176 }
export const NODE_H = { member: 56, agent: 56, hub: 92, gate: 78, manager: 56, workspace: 78, team: 56, token: 38 }

export const POS = {
  hub: { x: 330, y: 330 },
  gate: { x: 1010, y: 330 },
  manager: { x: 1010, y: 130 },
  workspace: { x: 1330, y: 300 },
  team: { x: 1330, y: 500 },
}
export const memberPos = (i) => ({ x: 10, y: 30 + i * 76 })
export const agentPos = (i) => ({ x: 680, y: 30 + i * 118 })

const badge = (n) => (n > 0 ? <span className="nd-badge">{n}</span> : null)

export function MemberNode({ data }) {
  return (
    <div className={`nd member ${data.selected ? 'sel' : ''}`} style={{ borderColor: data.color }}>
      <Handle type="source" position={Position.Right} />
      <span className="nd-avatar" style={{ background: data.color }}>{data.initials}</span>
      <span className="nd-text"><strong>{data.name}</strong><small>{data.role}</small></span>
      {badge(data.activeCount)}
    </div>
  )
}

export function AgentNode({ data }) {
  return (
    <div className={`nd agent ${data.selected ? 'sel' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <span className="nd-ico">{data.icon}</span>
      <span className="nd-text"><strong>{data.name}</strong><small>{data.desc}</small></span>
      <span className={`nd-dot ${data.busy ? 'busy' : 'idle'}`} />
      {data.progress > 0 && data.progress < 100 && (
        <span className="nd-progress"><i style={{ width: `${data.progress}%` }} /></span>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export function HubNode({ data }) {
  return (
    <div className={`nd hub ${data.selected ? 'sel' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <span className="nd-ico big">🤖</span>
      <span className="nd-text"><strong>Trợ lý trung tâm</strong><small>Nhận lệnh · tách việc · giao AI · trả kết quả</small></span>
      {badge(data.activeCount)}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export function GateNode({ data }) {
  return (
    <div className={`nd gate ${data.selected ? 'sel' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Top} id="from-manager" />
      <span className="nd-ico big">🚪</span>
      <span className="nd-text"><strong>Cổng duyệt</strong><small>AI tự duyệt nếu đủ · không thì chờ quản lý</small></span>
      {badge(data.queueCount)}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export function ManagerNode({ data }) {
  return (
    <div className={`nd manager ${data.selected ? 'sel' : ''}`}>
      <span className="nd-avatar" style={{ background: data.color }}>{data.initials}</span>
      <span className="nd-text"><strong>{data.name}</strong><small>Quản lý dự án · quyết cuối cùng</small></span>
      {badge(data.queueCount)}
      <Handle type="source" position={Position.Bottom} id="to-gate" />
    </div>
  )
}

export function WorkspaceNode({ data }) {
  return (
    <div className={`nd workspace ${data.selected ? 'sel' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <span className="nd-ico big">🏛️</span>
      <span className="nd-text"><strong>Workspace chung</strong><small>“Sự thật duy nhất” · chỉ bản đã duyệt</small></span>
      {badge(data.count)}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export function TeamNode({ data }) {
  return (
    <div className={`nd team ${data.selected ? 'sel' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <span className="nd-ico big">📣</span>
      <span className="nd-text"><strong>Kênh nhóm</strong><small>Chỉ tin ngắn · không kèm file</small></span>
      {badge(data.count)}
    </div>
  )
}

export function TaskNode({ data }) {
  return (
    <div className={`nd token st-${data.status}`}>
      <span className="tk-code">{data.code}</span>
      <span className="tk-title">{data.title}</span>
    </div>
  )
}

export const nodeTypes = {
  member: MemberNode,
  agent: AgentNode,
  hub: HubNode,
  gate: GateNode,
  manager: ManagerNode,
  workspace: WorkspaceNode,
  team: TeamNode,
  task: TaskNode,
}
