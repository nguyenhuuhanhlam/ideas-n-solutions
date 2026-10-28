import { Handle, Position } from '@xyflow/react'

function NodeShell({ data, className, icon, children }) {
  return (
    <div className={`qm-node ${className} ${data.selected ? 'sel' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <span className="qm-ico">{icon}</span>
      <span className="qm-text">
        <strong>{data.title}</strong>
        <small>{data.subtitle}</small>
      </span>
      {data.childCount > 0 && (
        <button
          type="button"
          className="qm-toggle"
          title={data.collapsed ? `Mở ${data.childCount} node con` : 'Thu gọn nhánh này'}
          onClick={(e) => {
            e.stopPropagation()
            data.onToggle?.(data.id)
          }}
        >
          {data.collapsed ? `+${data.childCount}` : '−'}
        </button>
      )}
      <Handle type="source" position={Position.Right} />
      {children}
    </div>
  )
}

export function RootNode({ data }) {
  return (
    <NodeShell data={data} className="root" icon="🌐">
      <span className="qm-badge">gốc</span>
    </NodeShell>
  )
}

export function QuestionNode({ data }) {
  return (
    <NodeShell data={data} className="question" icon="❓" />
  )
}

export function ChildNode({ data }) {
  return (
    <NodeShell data={data} className="child" icon="↳" />
  )
}

export const nodeTypes = {
  root: RootNode,
  question: QuestionNode,
  child: ChildNode,
}
