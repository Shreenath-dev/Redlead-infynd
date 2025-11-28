import React, { useCallback, useState, useMemo, useEffect } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Controls,
  Panel,
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
  Trash2,
  Edit,
} from "lucide-react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

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
      p-4 shadow-lg rounded-xl border-2 min-w-[250px] bg-white
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

// --- 3. Dynamic Flow Generation Utility (Enhanced for Sequential Days) ---

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

  // 1. Start Node
  const startNodeId = `${nodeIdCounter++}`;
  initialNodes.push({
    id: startNodeId,
    type: "startNode",
    data: { label: "Sequence start", type: "start", waitDays: 0 },
    position: { x: 0, y: 0 },
  });
  lastNodeId = startNodeId;

  // CRITICAL FIX: Use regex to reliably split by "Day X:" pattern and capture the action.
  const stepRegex = /(Day\s+\d+:\s*[^,;]+)/g;

  // Get all explicit Day steps. This handles the comma-separated or long string formats.
  const stepsArray = stepsText.match(stepRegex) || [];

  for (let i = 0; i < stepsArray.length; i++) {
    const stepText = stepsArray[i].trim();
    const currentNodeId = `${nodeIdCounter++}`;
    const lowerText = stepText.toLowerCase();

    // --- Calculate Day/Wait Time ---
    const dayMatch = stepText.match(/Day\s+(\d+):/i);
    const currentDay = dayMatch ? parseInt(dayMatch[1], 10) : previousDay + 1; // Default to next day if parsing fails

    let waitDays: number | "immediate";
    if (i === 0) {
      waitDays = "immediate";
    } else {
      // Calculate wait time: difference between current day number and previous day number
      waitDays = Math.max(1, currentDay - previousDay);
    }
    previousDay = currentDay; // Update tracker for the next iteration

    // --- Determine Action Type and Label ---
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

    // --- Create Node and Edge ---
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

    // Break early if we encounter a conditional step in the future (simplified for this parser)
    if (lowerText.includes("if") || lowerText.includes("else")) {
      // In a simplified parser, we treat the rest as a simple linear flow starting from here.
      break;
    }
  }

  return getLayoutedElements(initialNodes, initialEdges);
};

// --- 4. Main Component Integration (Flow, SequencePage, etc. remain the same) ---

const Flow = ({
  flowElements,
  initialFitView,
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
    <div className="flex flex-col flex-grow">
      <div
        className="flex-grow h-full min-h-0 bg-white border-l border-gray-200"
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
          <Panel position="top-right" className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-gray-800 mr-4">
              Sales Cadence Sequence
            </h2>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition border">
              🔍
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

// --- 5. Sidebar and Provider Wrapper (Unchanged) ---

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  nodeType: SequenceNodeData["type"];
  tailwindColor: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  nodeType,
  tailwindColor,
}) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`flex items-center space-x-3 p-3 text-sm font-medium rounded-lg cursor-grab bg-gray-50 hover:bg-white border border-gray-200 shadow-sm transition-all duration-150 
            ${tailwindColor}`}
      onDragStart={onDragStart}
      draggable
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );
};

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <aside
      className={`
            fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-2xl z-50 transform 
            transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            flex flex-col
        `}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <span className="text-lg font-bold text-gray-800">Add Step</span>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto">
        <h3 className="text-xs font-extrabold uppercase text-red-600 mb-3">
          COMMUNICATION
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <SidebarItem
            icon={Mail}
            label="Email"
            nodeType="email"
            tailwindColor="text-green-600"
          />
          <SidebarItem
            icon={Phone}
            label="Call"
            nodeType="call"
            tailwindColor="text-red-600"
          />
          <SidebarItem
            icon={Link}
            label="LinkedIn"
            nodeType="linkedin"
            tailwindColor="text-blue-600"
          />
        </div>

        <h3 className="text-xs font-extrabold uppercase text-red-600 mb-3 pt-4 border-t border-red-200">
          LOGIC
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <SidebarItem
            icon={Clock}
            label="Wait Period"
            nodeType="wait"
            tailwindColor="text-gray-600"
          />
          <SidebarItem
            icon={GitBranch}
            label="Condition"
            nodeType="condition"
            tailwindColor="text-pink-600"
          />
        </div>
      </div>
    </aside>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <div className="absolute top-4 left-4 z-40 bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-2">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center text-sm font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Builder
        </button>

        <div className="h-6 w-px bg-gray-200"></div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm font-medium
                ${
                  isSidebarOpen
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-red-600 hover:bg-red-50"
                }`}
        >
          {isSidebarOpen ? (
            <>
              <X className="h-4 w-4" /> <span>Close Tools</span>
            </>
          ) : (
            <>
              <PenTool className="h-4 w-4" /> <span>Edit Steps</span>
            </>
          )}
        </button>
      </div>
    ),
    [isSidebarOpen, onBack]
  );

  return (
    <div className="flex h-screen w-screen relative overflow-hidden bg-gray-100">
      {ActionToolbar}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <ReactFlowProvider>
        <Flow
          flowElements={flowElements}
          initialFitView={!!initialCadenceSteps}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default SequencePage;
