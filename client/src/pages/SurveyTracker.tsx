import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import type { SurveyItem } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit2, Filter, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  Low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
};

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export default function SurveyTracker() {
  const { token, isAdmin } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingItem, setEditingItem] = useState<SurveyItem | null>(null);

  const { data: items = [], isLoading } = useQuery<SurveyItem[]>({
    queryKey: ["/api/survey-items"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SurveyItem> }) => {
      const res = await fetch(`${""}/api/survey-items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/survey-items"] });
      setEditingItem(null);
      toast({ title: "Item updated", description: "Survey item has been updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterCategory !== "all" && item.category !== filterCategory) return false;
      if (filterPriority !== "all" && item.priority !== filterPriority) return false;
      if (filterStatus !== "all" && item.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.surveyId.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.task && item.task.toLowerCase().includes(q)) ||
          (item.materials && item.materials.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [items, filterCategory, filterPriority, filterStatus, search]);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.status === "completed").length;
    const inProgress = items.filter((i) => i.status === "in-progress").length;
    const pending = items.filter((i) => i.status === "pending").length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, pending, pct };
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-1" data-testid="text-survey-title">Survey Tracker</h1>
      <p className="text-sm text-muted-foreground mb-6">Marine survey findings and maintenance tracking for S/V Colleen.</p>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-6" data-testid="section-progress">
        <div className="flex flex-wrap items-center gap-6 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold" data-testid="text-stat-total">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Items</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold" data-testid="text-stat-completed">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold" data-testid="text-stat-inprogress">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xl font-bold" data-testid="text-stat-pending">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span className="font-semibold" data-testid="text-stat-pct">{stats.pct}%</span>
            </div>
            <Progress value={stats.pct} className="h-2" data-testid="progress-bar" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5" data-testid="section-filters">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input type="search" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" data-testid="input-search" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]" data-testid="select-category">
            <Filter className="w-3.5 h-3.5 mr-1.5 opacity-50" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[140px]" data-testid="select-priority">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]" data-testid="select-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-muted rounded animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-card border border-card-border rounded-xl overflow-hidden" data-testid="table-survey-items">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Priority</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground min-w-[250px]">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Task</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                  {isAdmin && <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors" data-testid={`row-survey-${item.surveyId}`}>
                    <td className="px-4 py-3 font-mono font-semibold text-foreground">{item.surveyId}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs border ${priorityColors[item.priority] || ""}`} data-testid={`badge-priority-${item.surveyId}`}>{item.priority}</Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground leading-relaxed">{item.description}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.task || "\u2014"}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${statusColors[item.status] || ""}`} data-testid={`badge-status-${item.surveyId}`}>{item.status}</Badge>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)} data-testid={`button-edit-${item.surveyId}`} className="gap-1">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-muted-foreground" data-testid="text-no-results">No items match the current filters.</div>
          )}
        </div>
      )}

      <div className="mt-3 text-xs text-muted-foreground">Showing {filteredItems.length} of {items.length} items</div>

      {editingItem && (
        <EditDialog
          item={editingItem}
          open={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updates) => { updateMutation.mutate({ id: editingItem.id, updates }); }}
          isPending={updateMutation.isPending}
        />
      )}
    </div>
  );
}

function EditDialog({ item, open, onClose, onSave, isPending }: { item: SurveyItem; open: boolean; onClose: () => void; onSave: (updates: Partial<SurveyItem>) => void; isPending: boolean; }) {
  const [task, setTask] = useState(item.task || "");
  const [materials, setMaterials] = useState(item.materials || "");
  const [estimatedCompletion, setEstimatedCompletion] = useState(item.estimatedCompletion || "");
  const [actualCompletion, setActualCompletion] = useState(item.actualCompletion || "");
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes || "");

  useEffect(() => {
    setTask(item.task || "");
    setMaterials(item.materials || "");
    setEstimatedCompletion(item.estimatedCompletion || "");
    setActualCompletion(item.actualCompletion || "");
    setStatus(item.status);
    setNotes(item.notes || "");
  }, [item]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-lg" data-testid="dialog-edit-item">
        <DialogHeader>
          <DialogTitle>Edit Item {item.surveyId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{item.category}</span> \u2014 {item.description}
          </div>
          <div>
            <Label htmlFor="edit-task">Task</Label>
            <Input id="edit-task" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Specific task to complete..." data-testid="input-edit-task" />
          </div>
          <div>
            <Label htmlFor="edit-materials">Materials Needed</Label>
            <Input id="edit-materials" value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="Materials needed..." data-testid="input-edit-materials" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit-est">Est. Completion</Label>
              <Input id="edit-est" type="date" value={estimatedCompletion} onChange={(e) => setEstimatedCompletion(e.target.value)} data-testid="input-edit-estimated" />
            </div>
            <div>
              <Label htmlFor="edit-actual">Actual Completion</Label>
              <Input id="edit-actual" type="date" value={actualCompletion} onChange={(e) => setActualCompletion(e.target.value)} data-testid="input-edit-actual" />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger data-testid="select-edit-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea id="edit-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." data-testid="input-edit-notes" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} data-testid="button-edit-cancel">Cancel</Button>
            <Button onClick={() => onSave({ task, materials, estimatedCompletion, actualCompletion, status, notes })} disabled={isPending} data-testid="button-edit-save">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
