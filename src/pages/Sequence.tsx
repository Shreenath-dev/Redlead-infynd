import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  useUpdateNodeInternals,
  Background,
  Handle,
  Position,
  ReactFlowInstance,
} from "@xyflow/react";
import {
  Mail,
  Phone,
  Link,
  Clock,
  GitBranch,
  PenTool,
  X,
  ChevronLeft,
  Minus,
  Plus,
  Edit,
} from "lucide-react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

// --- 1. Layouting Setup (Dagre) ---

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 90;

const getLayoutedElements = (
  nodes: Node<SequenceNodeData>[],
  edges: Edge[],
  direction = "TB"
) => {
  if (nodes.length === 0) return { nodes, edges };

  dagreGraph.setGraph({ rankdir: direction, ranksep: 60, nodesep: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  if (edges.length > 0) {
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
  }

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

// --- 2. Type Definitions and Node Component ---

interface SequenceNodeData {
  label: string;
  type: "email" | "call" | "linkedin" | "wait" | "condition" | "start";
  details?: string;
  waitDays: number | "immediate";
  emailId?: string;
}

const getNodeVisuals = (type: SequenceNodeData["type"]) => {
  switch (type) {
    case "email":
      return { icon: Mail, color: "text-green-600 bg-green-100" };
    case "call":
      return { icon: Phone, color: "text-red-600 bg-red-100" };
    case "linkedin":
      return { icon: Link, color: "text-blue-600 bg-blue-100" };
    case "wait":
      return { icon: Clock, color: "text-gray-600 bg-gray-100" };
    case "condition":
      return { icon: GitBranch, color: "text-pink-600 bg-pink-100" };
    case "start":
      return { icon: null, color: "text-gray-800 bg-gray-100" };
    default:
      return { icon: null, color: "text-gray-800 bg-white" };
  }
};

const StepNode: React.FC<any> = ({ id, data, selected }) => {
  const { icon: Icon, color } = getNodeVisuals(data.type);
  const isStart = data.type === "start";
  const isCondition = data.type === "condition";
  const isActionStep = ["email", "call", "linkedin"].includes(data.type);

  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const [isEditingWait, setIsEditingWait] = useState(false);
  const [localWaitDays, setLocalWaitDays] = useState(
    data.waitDays === "immediate" ? 0 : data.waitDays
  );

  useEffect(() => {
    setLocalWaitDays(data.waitDays === "immediate" ? 0 : data.waitDays);
  }, [data.waitDays]);

  const commitWaitTime = (newWaitDays: number) => {
    const days = Math.max(0, newWaitDays);

    setLocalWaitDays(days);
    setIsEditingWait(false);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            waitDays: days === 0 ? "immediate" : days,
          };
        }
        return node;
      })
    );
    updateNodeInternals(id);
  };

  const handleWaitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setLocalWaitDays(isNaN(value) ? 0 : value);
  };

  if (isStart) {
    return (
      <div className="py-2 px-6 rounded-full shadow-md bg-white border border-gray-300 text-sm font-semibold text-gray-700">
        {data.label}
        <Handle
          type="source"
          position={Position.Bottom}
          id="output"
          className="w-3 h-3 bg-red-500 border-2 border-white"
        />
      </div>
    );
  }

  const WaitControl = () => {
    if (isEditingWait) {
      return (
        <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 p-1">
          <span className="text-sm font-medium text-gray-700 ml-1">Wait</span>

          <div className="flex border rounded-md overflow-hidden divide-x">
            <button
              onClick={() => commitWaitTime(localWaitDays - 1)}
              className="p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              disabled={localWaitDays <= 0}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={localWaitDays}
              onChange={handleWaitChange}
              onBlur={() => commitWaitTime(localWaitDays)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                  commitWaitTime(localWaitDays);
                }
              }}
              className="w-8 text-center text-sm font-semibold border-none focus:ring-0 p-1 m-0 bg-white h-7"
              min="0"
            />
            <button
              onClick={() => commitWaitTime(localWaitDays + 1)}
              className="p-1 rounded-r-md text-gray-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <span className="text-sm font-medium text-gray-700">day</span>

          <button
            onClick={() => setIsEditingWait(false)}
            className="p-1 text-gray-400 hover:text-red-500 transition ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div
        className="flex items-center space-x-2 text-sm font-medium text-gray-800 cursor-pointer transition"
        onClick={() => setIsEditingWait(true)}
      >
        <Clock className="h-4 w-4 text-blue-600" />
        <span className="text-blue-600">
          {data.waitDays === "immediate"
            ? "Send immediately"
            : `Wait for ${data.waitDays} day${data.waitDays > 1 ? "s" : ""}`}
        </span>
        <Edit className="h-4 w-4 ml-2 text-gray-400 hover:text-red-600" />
      </div>
    );
  };

  return (
    <div
      className={`
      p-4 shadow-lg  rounded-xl border-2 min-w-[250px] bg-white
      ${selected ? "border-red-500" : "border-gray-200"}
      transition duration-200 ease-in-out hover:shadow-xl hover:border-red-400
    `}
    >
      {/* Target Handle: Input from the previous step */}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Top}
          id="input"
          className="w-3 h-3 bg-gray-500 border-2 border-white"
          style={{ left: "50%" }}
        />
      )}

      <div className="flex items-center justify-between mb-2">
        <WaitControl />
      </div>

      {(isActionStep || isCondition) && (
        <div className="flex items-center justify-between space-x-2 border-t pt-3 mt-2">
          {isActionStep && (
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${color.split(" ")[1]}`}>
                <Icon className={`h-5 w-5 ${color.split(" ")[0]}`} />
              </div>
              <div className="flex flex-col">
                <span
                  className={`leading-tight text-lg text-gray-800 font-semibold`}
                >
                  {data.label}
                </span>
                {data.details && (
                  <div className="mt-0.5 text-sm text-gray-500">
                    {data.details}
                  </div>
                )}
                {/* Source Handle for linear actions */}
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id="output"
                  className="w-3 h-3 bg-red-500 border-2 border-white"
                  style={{ left: "50%" }}
                />
              </div>
            </div>
          )}

          {isCondition && (
            <div className="flex items-center space-x-2 py-2 text-pink-600 font-semibold w-full justify-center relative">
              <GitBranch className="h-5 w-5" />
              <span className="text-md">{data.label}</span>

              <Handle
                type="source"
                position={Position.Bottom}
                id="a"
                className="w-3 h-3 bg-green-500 border-2 border-white"
                style={{ left: "25%" }}
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                className="w-3 h-3 bg-red-500 border-2 border-white"
                style={{ left: "75%" }}
              />
            </div>
          )}

          {isActionStep && (
            <div className="w-9 h-9 rounded-full bg-red-600 text-white font-semibold flex items-center justify-center text-md shrink-0">
              {data.emailId || "S"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  startNode: StepNode,
  stepNode: StepNode,
};

// --- 3. Dynamic Flow Generation Utility (REMAINS THE SAME) ---

const parseStepsToFlow = (
  stepsText: string,
  senderId: string = "S"
): { nodes: Node<SequenceNodeData>[]; edges: Edge[] } => {
  if (!stepsText || stepsText.toLowerCase().includes("pending")) {
    const startNode: Node<SequenceNodeData> = {
      id: "1",
      type: "startNode",
      data: { label: "Sequence start", type: "start", waitDays: 0 },
      position: { x: 0, y: 0 },
    };
    return getLayoutedElements([startNode], []);
  }

  const initialNodes: Node<SequenceNodeData>[] = [];
  const initialEdges: Edge[] = [];
  let nodeIdCounter = 1;
  let lastNodeId: string | null = null;
  let previousDay = 0;

  const startNodeId = `${nodeIdCounter++}`;
  initialNodes.push({
    id: startNodeId,
    type: "startNode",
    data: { label: "Sequence start", type: "start", waitDays: 0 },
    position: { x: 0, y: 0 },
  });
  lastNodeId = startNodeId;

  const stepRegex = /(Day\s+\d+:\s*[^,;]+)/g;
  const stepsArray = stepsText.match(stepRegex) || [];

  for (let i = 0; i < stepsArray.length; i++) {
    const stepText = stepsArray[i].trim();
    const currentNodeId = `${nodeIdCounter++}`;
    const lowerText = stepText.toLowerCase();

    const dayMatch = stepText.match(/Day\s+(\d+):/i);
    const currentDay = dayMatch ? parseInt(dayMatch[1], 10) : previousDay + 1;

    let waitDays: number | "immediate";

    if (i === 0 && currentDay === 1) {
      waitDays = "immediate";
      previousDay = currentDay;
    } else if (i === 0 && currentDay > 1) {
      waitDays = currentDay;
      previousDay = currentDay;
    } else {
      waitDays = Math.max(1, currentDay - previousDay);
      previousDay = currentDay;
    }

    let type: SequenceNodeData["type"] = "email";
    let label = "Action";

    if (lowerText.includes("email")) {
      type = "email";
      label = lowerText.includes("follow-up")
        ? "Follow-up Email"
        : "Personalized Email";
    } else if (lowerText.includes("call")) {
      type = "call";
      label = "Personalized Call";
    } else if (lowerText.includes("linkedin")) {
      type = "linkedin";
      label = lowerText.includes("visit")
        ? "Visit profile"
        : "LinkedIn Connect";
    }

    const newNode: Node<SequenceNodeData> = {
      id: currentNodeId,
      type: "stepNode",
      data: {
        label,
        type,
        waitDays,
        details:
          stepText.length > 50 ? stepText.substring(0, 47) + "..." : stepText,
        emailId: senderId,
      },
      position: { x: 0, y: 0 },
    };

    if (lastNodeId) {
      initialEdges.push({
        id: `e${lastNodeId}-${currentNodeId}`,
        source: lastNodeId,
        target: currentNodeId,
        sourceHandle: "output",
        targetHandle: "input",
        type: "smoothstep",
        style: { stroke: "#A0AEC0" },
      });
    }

    initialNodes.push(newNode);
    lastNodeId = currentNodeId;

    if (lowerText.includes("if") || lowerText.includes("else")) {
      break;
    }
  }

  return getLayoutedElements(initialNodes, initialEdges);
};


const Flow = ({
  flowElements,
}: {
  flowElements: { nodes: Node<SequenceNodeData>[]; edges: Edge[] };
  initialFitView: boolean;
}) => {
  const [nodes, setNodes] = useState(flowElements.nodes);
  const [edges, setEdges] = useState(flowElements.edges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    setNodes(flowElements.nodes);
    setEdges(flowElements.edges);
    if (reactFlowInstance) {
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 100);
    }
  }, [flowElements, reactFlowInstance]);

  const enforceLayout = useCallback(
    (currentNodes: Node<SequenceNodeData>[], currentEdges: Edge[]) => {
      const { nodes: newLayoutedNodes, edges: newLayoutedEdges } =
        getLayoutedElements(currentNodes, currentEdges);
      setNodes(newLayoutedNodes);
      setEdges(newLayoutedEdges);

      if (reactFlowInstance) {
        setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50);
      }
    },
    [reactFlowInstance]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
      const shouldRelayout = changes.some((c) => c.type === "remove");
      if (shouldRelayout) enforceLayout(nodes, edges);
    },
    [setEdges, nodes, edges, enforceLayout]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const newEdges = addEdge(
        { ...connection, type: "smoothstep", style: { stroke: "#A0AEC0" } },
        edges
      );
      setEdges(newEdges);
      enforceLayout(nodes, newEdges);
    },
    [setEdges, nodes, edges, enforceLayout]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) return;

      const supportedTypes: SequenceNodeData["type"][] = [
        "email",
        "call",
        "linkedin",
        "wait",
        "condition",
      ];

      if (!supportedTypes.includes(type as SequenceNodeData["type"])) {
        // Handle mock/unsupported types from the large modal
        const labelMap: { [key: string]: string } = {
          whatsapp: "WhatsApp Message",
          chat: "Chat Message",
          voice: "Voice Message",
          aivoice: "AI Voice Message",
          invite: "LinkedIn Invitation",
          visit: "Visit Profile",
          manual: "Manual Task",
          api: "Call API",
          campaign: "Send to Campaign",
          "ai-variable": "AI Variable",
        };
        const defaultType: SequenceNodeData["type"] = "email"; // Fallback to 'email' visual type
        const defaultLabel =
          labelMap[type] ||
          `${type.charAt(0).toUpperCase() + type.slice(1)} Action`;

        const newNode: Node<SequenceNodeData> = {
          id: `node-${Date.now()}`,
          type: "stepNode",
          position: { x: 0, y: 0 },
          data: {
            label: defaultLabel,
            type: defaultType,
            details: `(Mock step: ${type})`,
            waitDays: 1,
          } as SequenceNodeData,
        };
        const newNodes = nodes.concat(newNode);
        enforceLayout(newNodes, edges);
        return;
      }

      const newNode: Node<SequenceNodeData> = {
        id: `node-${Date.now()}`,
        type: "stepNode",
        position: { x: 0, y: 0 },
        data: {
          label:
            type === "condition"
              ? "New Condition"
              : `${type.charAt(0).toUpperCase() + type.slice(1)} Action`,
          type: type as SequenceNodeData["type"],
          details:
            type === "email"
              ? "Enter template"
              : type === "call"
              ? "Create a task"
              : "",
          waitDays: type === "condition" ? 0 : 1,
        } as SequenceNodeData,
      };

      const newNodes = nodes.concat(newNode);
      enforceLayout(newNodes, edges);
    },
    [nodes, edges, enforceLayout]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
    instance.fitView({ padding: 0.2 });
  }, []);

  return (
    <div
      className="flex-grow h-full min-h-0 bg-white border-l w-full"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        onInit={onInit}
      >
        <Background variant="dots" gap={16} size={1} className="bg-gray-50" />
        <Controls className="bg-white rounded-lg shadow-md border border-gray-100" />
      </ReactFlow>
    </div>
  );
};


interface ModalItemProps {
  icon: React.ElementType;
  label: string;
  subLabel?: string;
  nodeType: string;
  color?: string;
  badge?: string;
  isLocked?: boolean;
}

const ModalItem: React.FC<ModalItemProps> = ({
  icon: Icon,
  label,
  subLabel,
  nodeType,
  color = "text-gray-700",
  badge,
  isLocked,
}) => {
  // Steps are draggable for flow building. Conditions are intended to be added on click.
  const isActionStep = nodeType.startsWith("step-") && !isLocked;
  const isCondition = nodeType.startsWith("condition-") && !isLocked;

  const borderClass = isActionStep
    ? "border-gray-200 hover:border-red-400"
    : "border-gray-200";
  const bgClass =
    isActionStep || isCondition ? "bg-white hover:bg-gray-50" : "bg-gray-50";
  // The cursor is grab for steps (draggable) and pointer for conditions (clickable)
  const cursorClass = isActionStep
    ? "cursor-grab"
    : isCondition
    ? "cursor-pointer"
    : "cursor-default opacity-80";

  const onDragStart = (event: React.DragEvent) => {
    if (isActionStep) {
      const simpleNodeType = nodeType.replace("step-", "");
      event.dataTransfer.setData("application/reactflow", simpleNodeType);
      event.dataTransfer.effectAllowed = "move";
    } else {
      event.preventDefault();
    }
  };

  const PlaceholderIcon = () => (
    <div
      className={`p-1.5 rounded-full border-2 ${color.replace(
        "text-",
        "border-"
      )} ${bgClass}`}
    >
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
  );

  const dragProps = isActionStep ? { onDragStart, draggable: true } : {};

  const handleItemClick = () => {
    // Logic for CONDITIONS: If it's a condition, it should trigger adding a conditional node
    if (isCondition) {
      // This simulates adding a 'condition' node type to the flow via click
      const conditionType = nodeType.replace("condition-", "");
      alert(`Simulating adding a Condition node: ${conditionType}`);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 text-center min-h-[90px] rounded-lg border ${borderClass} transition-all duration-150 ${cursorClass}`}
      onClick={handleItemClick}
      {...dragProps}
    >
      <div
        className={`absolute top-0 right-0 m-1 text-xs font-semibold ${
          isLocked ? "text-gray-500" : "text-red-500"
        }`}
      >
        {badge}
      </div>

      {/* Icon Area */}
      <PlaceholderIcon />

      {/* Label and Sub-label */}
      <span className="mt-1 text-sm font-medium text-gray-800 leading-tight">
        {label}
      </span>
      <span className="text-xs text-gray-500 block leading-snug">
        {subLabel}
      </span>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
          <span className="text-red-500 font-bold flex items-center">
            <span className="mr-1">🔒</span> Unlock
          </span>
        </div>
      )}
    </div>
  );
};

const StepsContent: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-xs font-extrabold uppercase text-gray-500">
      Automatic Steps
    </h3>
    <div className="grid grid-cols-4 gap-3">
      <ModalItem
        icon={Mail}
        label="Email"
        subLabel="Send automatic email"
        nodeType="step-email"
        color="text-green-600"
      />
      <ModalItem
        icon={Clock}
        label="WhatsApp"
        subLabel="Send WhatsApp message"
        nodeType="step-whatsapp"
        color="text-green-500"
        badge="Beta"
        isLocked={true}
      />
      <ModalItem
        icon={Link}
        label="Chat message"
        subLabel="Send on LinkedIn"
        nodeType="step-chat"
        color="text-blue-600"
      />
      <div className="col-span-1"></div>

      <ModalItem
        icon={Phone}
        label="Voice message"
        subLabel="Send on LinkedIn"
        nodeType="step-voice"
        color="text-blue-600"
      />
      <ModalItem
        icon={GitBranch}
        label="AI Voice message"
        subLabel="Send on LinkedIn"
        nodeType="step-aivoice"
        color="text-pink-600"
      />
      <ModalItem
        icon={Plus}
        label="Invitation"
        subLabel="Send on LinkedIn"
        nodeType="step-invite"
        color="text-blue-600"
      />
      <ModalItem
        icon={PenTool}
        label="Visit profile"
        subLabel="Visit profile"
        nodeType="step-visit"
        color="text-blue-600"
      />
    </div>

    <h3 className="text-xs font-extrabold uppercase text-gray-500 pt-3 border-t border-gray-100">
      Manual execution
    </h3>
    <div className="grid grid-cols-4 gap-3">
      <ModalItem
        icon={Phone}
        label="Call"
        subLabel="Create a task"
        nodeType="step-call"
        color="text-red-600"
      />
      <ModalItem
        icon={PenTool}
        label="Manual task"
        subLabel="Create a task"
        nodeType="step-manual"
        color="text-red-600"
      />
    </div>

    <h3 className="text-xs font-extrabold uppercase text-gray-500 pt-3 border-t border-gray-100">
      Other steps
    </h3>
    <div className="grid grid-cols-4 gap-3">
      <ModalItem
        icon={GitBranch}
        label="Call an API"
        subLabel="Call an API"
        nodeType="step-api"
        color="text-gray-600"
      />
      <ModalItem
        icon={Clock}
        label="Send to another campaign"
        subLabel="Send to another campaign"
        nodeType="step-campaign"
        color="text-gray-600"
      />
    </div>

    <h3 className="text-xs font-extrabold uppercase text-gray-500 pt-3 border-t border-gray-100">
      AI step
    </h3>
    <div className="grid grid-cols-4 gap-3">
      <ModalItem
        icon={GitBranch}
        label="AI variable"
        subLabel="Automatically fill a variable"
        nodeType="step-ai-variable"
        color="text-red-500"
      />
    </div>
  </div>
);

const ConditionsContent: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-xs font-extrabold uppercase text-gray-500">
      Lead information
    </h3>
    <div className="grid grid-cols-3 gap-3">
      <ModalItem
        icon={GitBranch}
        label="Has email address"
        nodeType="condition-email-exists"
      />
      <ModalItem
        icon={Link}
        label="Has LinkedIn URL"
        subLabel="LinkedIn"
        nodeType="condition-linkedin-url"
        color="text-blue-600"
      />
      <ModalItem
        icon={PenTool}
        label="Custom condition"
        nodeType="condition-custom"
      />
    </div>

    <h3 className="text-xs font-extrabold uppercase text-gray-500 pt-3 border-t border-gray-100">
      Lead actions
    </h3>
    <div className="grid grid-cols-4 gap-3">
      <ModalItem
        icon={Mail}
        label="Opened email"
        nodeType="condition-email-opened"
        color="text-green-600"
      />
      <ModalItem
        icon={Link}
        label="Clicked on link in email"
        nodeType="condition-link-clicked"
        color="text-green-600"
      />
      <ModalItem
        icon={X}
        label="Unsubscribe from email"
        nodeType="condition-unsubscribed"
        color="text-red-600"
      />
      <ModalItem
        icon={Clock}
        label="Booked a meeting"
        subLabel="lemcal"
        nodeType="condition-booked-meeting"
        color="text-red-600"
      />

      <ModalItem
        icon={Link}
        label="Accepted invite"
        subLabel="LinkedIn"
        nodeType="condition-linkedin-accepted"
        color="text-blue-600"
      />
      <ModalItem
        icon={Link}
        label="Opened linkedin message"
        subLabel="LinkedIn"
        nodeType="condition-linkedin-opened"
        color="text-blue-600"
      />
      <ModalItem
        icon={GitBranch}
        label="Has score"
        subLabel="Score"
        nodeType="condition-has-score"
        color="text-red-600"
      />
    </div>

    <h3 className="text-xs font-extrabold uppercase text-gray-500 pt-3 border-t border-gray-100">
      Call, WhatsApp & SMS
    </h3>
    <div className="grid grid-cols-3 gap-3">
      <ModalItem
        icon={Phone}
        label="Has phone number"
        nodeType="condition-has-phone"
        color="text-red-600"
      />
      <ModalItem
        icon={Phone}
        label="Call status"
        nodeType="condition-call-status"
        color="text-red-600"
      />
      <ModalItem
        icon={Clock}
        label="Has WhatsApp account"
        subLabel="WhatsApp"
        nodeType="condition-has-whatsapp"
        color="text-green-500"
        isLocked={true}
      />
    </div>
  </div>
);

const StepConditionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"Steps" | "Conditions">("Steps");

  return (
    // FIX: Modal is now positioned relative to the top-left flow area, 
    // just below the toolbar, using `top-16 left-4` instead of `top-20 left-1/2` centered.
    <div className="absolute top-16 left-4 w-[800px] max-w-3xl bg-white p-6 rounded-xl shadow-2xl border border-gray-100 z-50">
      <div className="flex justify-center mb-6">
        <div className="p-1 rounded-lg border border-gray-200 flex space-x-1">
          <button
            onClick={() => setActiveTab("Steps")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "Steps"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Steps
          </button>
          <button
            onClick={() => setActiveTab("Conditions")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "Conditions"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Conditions
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:bg-gray-100"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Ensures the content scrolls within the modal */}
      <div className="overflow-y-auto max-h-[85vh]">
        {activeTab === "Steps" && <StepsContent />}
        {activeTab === "Conditions" && (
          <>
            <p className="text-sm text-center text-gray-600 mb-6">
              Add conditions to your sequence and create decisions branches to
              get the best results possible
            </p>
            <ConditionsContent />
          </>
        )}
      </div>
    </div>
  );
};


interface SequencePageProps {
  initialCadenceSteps: string;
  onBack: () => void;
}

const SequencePage: React.FC<SequencePageProps> = ({
  initialCadenceSteps,
  onBack,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const flowElements = useMemo(() => {
    if (!initialCadenceSteps || initialCadenceSteps.length < 10) {
      const startNode: Node<SequenceNodeData> = {
        id: "1",
        type: "startNode",
        data: {
          label: "Sequence start",
          type: "start",
          waitDays: 0,
        } as SequenceNodeData,
        position: { x: 0, y: 0 },
      };
      return getLayoutedElements([startNode], []);
    }

    return parseStepsToFlow(initialCadenceSteps);
  }, [initialCadenceSteps]);

  const ActionToolbar = useMemo(
    () => (
      // Toolbar remains static relative to the flow view
      <div className="absolute top-4 left-4 z-40">
        <div className="relative bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-2">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Builder
          </button>

          <div className="h-6 w-px bg-gray-200"></div>

          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className={`p-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm font-medium
                ${
                  isModalOpen
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-red-600 hover:bg-red-50"
                }`}
          >
            {isModalOpen ? (
              <>
                <X className="h-4 w-4" /> <span>Close Tools</span>
              </>
            ) : (
              <>
                <PenTool className="h-4 w-4" /> <span>Edit Steps</span>
              </>
            )}
          </button>

          {/* Modal is rendered outside this container for screen centering */}
        </div>
      </div>
    ),
    [isModalOpen, onBack]
  );

  return (
    <div className="flex h-full w-full relative bg-red-100">
      {ActionToolbar}

      <ReactFlowProvider>
        <Flow
          flowElements={flowElements}
          initialFitView={!!initialCadenceSteps}
        />
      </ReactFlowProvider>

      {isModalOpen && (
        <StepConditionModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default SequencePage;