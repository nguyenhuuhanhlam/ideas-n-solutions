import { Handle, Position } from '@xyflow/react'

function NodeShell({ data, className, icon, children }) {
  return (
    <div className={`qm-node ${className} ${data.selected ? 'sel' : ''} ${data.multiSelected ? 'multi' : ''}`}>
      {children}
      <Handle type="target" position={Position.Left} />
      <span className="qm-ico">{icon}</span>
      <span className="qm-text">
        <strong>{data.title}</strong>
        <small>{data.subtitle}{data.merged ? ` · gộp ${data.sectionCount} section` : ''}</small>
      </span>
      {data.multiSelected && <span className="qm-check">✓</span>}
      {data.childCount > 0 && (
        <button
          type="button"
          className="qm-toggle"
          title={data.collapsed ? `Mở ${data.childCount} nhánh con` : 'Thu gọn nhánh này'}
          onClick={(e) => {
            e.stopPropagation()
            data.onToggle?.(data.id)
          }}
        >
          {data.collapsed ? `+${data.childCount}` : '−'}
        </button>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export function RootNode({ data }) {
  return (
    <NodeShell data={data} className="root" icon="🧠">
      <span className="qm-badge">gốc</span>
    </NodeShell>
  )
}

export function TopicNode({ data }) {
  return <NodeShell data={data} className="topic" icon="📁" />
}

export function SubtopicNode({ data }) {
  return <NodeShell data={data} className="subtopic" icon="📄" />
}

export const nodeTypes = {
  root: RootNode,
  topic: TopicNode,
  subtopic: SubtopicNode,
}
