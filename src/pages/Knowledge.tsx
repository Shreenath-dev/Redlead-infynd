import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Folder, Plus, Search, MoreVertical, Trash2, Edit, FileText, Upload, ChevronDown,
  LayoutList, Grid3x3, AlertTriangle, FileUp, Download
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// --- EXPANDED DUMMY DATA (Unchanged) ---
const generateDocuments = (folderId, count) => {
  const documentTypes = [".pdf", ".docx", ".xlsx", ".pptx", ".jpg"];
  const documents = [];
  for (let i = 1; i <= count; i++) {
    const type = documentTypes[i % documentTypes.length];
    const size = (Math.random() * 5 + 0.5).toFixed(1); 
    documents.push({
      id: folderId * 100 + i,
      name: `Document_${folderId}_${i}${type}`,
      size: `${size}MB`
    });
  }
  return documents;
};

const generateFolders = (count) => {
  const folders = [];
  for (let i = 1; i <= count; i++) {
    const isMainFolder = i === 1;
    const documentCount = isMainFolder ? 15 : Math.floor(Math.random() * 3); 
    folders.push({
      id: i,
      name: isMainFolder ? `🔴 Primary Campaign Assets (${i})` : `Campaign Resource Folder ${i}`,
      description: `Support documentation for campaign series ${i}.`,
      documents: generateDocuments(i, documentCount),
    });
  }
  return folders;
};

const initialFolders = generateFolders(15); 
// --- END OF DUMMY DATA ---

// --- MODAL COMPONENT (Unchanged) ---
const CreateFolderModal = ({ isOpen, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!folderName) return;

    const newFolder = {
      id: Date.now(), 
      name: folderName,
      description: description,
      documents: file ? [{ id: Date.now() + 1, name: file.name, size: `${(file.size / 1024).toFixed(0)}KB` }] : [],
    };
    onCreate(newFolder);
    setFolderName("");
    setDescription("");
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Knowledge Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              required
              placeholder="e.g., Campaign Pitch Documents"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the content."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fileUpload">Initial File Upload (Optional)</Label>
            <Input
              id="fileUpload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </form>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Create Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function KnowledgeBase() {
  const [folders, setFolders] = useState(initialFolders);
  const [selectedFolderId, setSelectedFolderId] = useState(folders.length > 0 ? folders[0].id : null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  const handleCreateFolder = (newFolder) => {
    setFolders([...folders, newFolder]);
    setSelectedFolderId(newFolder.id);
  };

  const handleDeleteFolder = (id) => {
    const updatedFolders = folders.filter(f => f.id !== id);
    setFolders(updatedFolders);
    if (selectedFolderId === id) {
      setSelectedFolderId(updatedFolders.length > 0 ? updatedFolders[0].id : null);
    }
  };

  const handleAddDocument = () => {
    alert(`Adding new document to ${selectedFolder.name}`);
  };
  
  // Renders when no folders exist
  if (folders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] flex-col p-8 bg-white rounded-lg shadow-sm">
        <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Knowledge Folders Found</h2>
        <p className="text-gray-500 mb-6">Start by creating your first folder to organize support documents for your campaigns or products.</p>
        <Button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" /> Create Folder
        </Button>
        <CreateFolderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateFolder}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] bg-white border-b border-gray-200"> 
      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateFolder}
      />

      <div className="w-64 border-r flex flex-col">
        <div className="p-3 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold">Folders ({folders.length})</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        
        <div className="p-3 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search folders..." className="pl-8 text-sm" />
          </div>
        </div>

        <div className="h-full scroll-on-hover"> 
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedFolderId === folder.id ? 'bg-red-50 border-r-4 border-red-600 font-medium' : 'text-gray-700'}`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              <div className="flex items-center truncate">
                <Folder className={`h-4 w-4 mr-3 ${selectedFolderId === folder.id ? 'text-red-600' : 'text-gray-500'}`} />
                <span className="truncate">{folder.name}</span>
              </div>
              
              {/* Three-dot menu placeholder */}
              <div className="relative group">
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
                {/* Simplified: Actual dropdown logic is complex, using alert for demo */}
                <div className="absolute right-0 top-0 hidden group-hover:block bg-white border rounded shadow-lg z-10">
                  <div className="p-2 text-sm text-gray-700 flex items-center hover:bg-gray-100" onClick={() => alert(`Edit ${folder.name}`)}><Edit className="h-4 w-4 mr-2"/> Edit</div>
                  <div className="p-2 text-sm text-red-600 flex items-center hover:bg-red-50" onClick={() => handleDeleteFolder(folder.id)}><Trash2 className="h-4 w-4 mr-2"/> Delete</div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Document List */}
      <div className="flex-grow flex flex-col">
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {selectedFolder?.name} ({selectedFolder?.documents.length || 0} documents)
          </h2>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-gray-700 hover:bg-gray-100">
              <LayoutList className="h-4 w-4 mr-2" /> List View <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <Button onClick={handleAddDocument} className="bg-red-600 hover:bg-red-700">
              <FileUp className="mr-2 h-4 w-4" /> Add Document
            </Button>
          </div>
        </div>

        {/* Scrolling Document List - Uses custom CSS for scroll-on-hover */}
        <div className="p-4 scroll-on-hover h-full"> 
          {selectedFolder?.documents.length === 0 ? (
            <div className="flex items-center justify-center min-h-[50vh] flex-col p-8">
              <FileText className="h-10 w-10 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Documents in This Folder</h3>
              <p className="text-gray-500 mb-6">Upload support files related to this topic.</p>
              <Button onClick={handleAddDocument} variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedFolder?.documents.map(doc => (
                <Card key={doc.id} className="p-3 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-3" /> 
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <p className="text-xs text-gray-500">Size: {doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-800">
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}