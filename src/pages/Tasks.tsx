import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

export default function Tasks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Tasks</h1>
        <p className="text-text-secondary mt-1">Manage your follow-up tasks</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-text-secondary">
              Tasks will appear here as campaigns progress
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
