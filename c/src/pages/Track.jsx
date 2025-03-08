import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card } from "../components/ui/card";
import { Search, NotebookPen, CalendarDays, X, ExternalLink, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { useSavedJobs } from "../Context/SavedJobContext";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Helmet } from "react-helmet-async";
import useUserData from "../Context/UserContext";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

const statusOptions = [
  { value: "Saved", label: "Saved", color: "#64748b" },
  { value: "Applied", label: "Applied", color: "#3b82f6" },
  { value: "Interviewing", label: "Interviewing", color: "#8b5cf6" },
  { value: "Offered", label: "Offered", color: "#10b981" },
  { value: "Rejected", label: "Rejected", color: "#ef4444" },
];

export default function JobDashboard() {
  const { savedJobs } = useSavedJobs();
  const { userData } = useUserData();
  const [jobsData, setJobsData] = useState([]);
  const [notes, setNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState(new Set());

  useEffect(() => {
    setJobsData(savedJobs);
  }, [savedJobs]);

  const handleStatusChange = (jobId, newStatus) => {
    setJobsData(prev =>
      prev.map(job =>
        job.jobId === jobId ? { ...job, status: newStatus } : job
      )
    );
  };

  const handleSelectAll = (checked) => {
    const ids = filteredJobs.map(job => job.jobId);
    setSelectedJobs(prev => {
      const next = new Set(prev);
      if (checked) {
        ids.forEach(id => next.add(id));
      } else {
        ids.forEach(id => next.delete(id));
      }
      return next;
    });
  };

  const handleDelete = async () => {
    if (!selectedJobs.size || !userData?.email) return;
    console.log("selectedJobs", selectedJobs);
    console.log("userData.email", userData.email);

    try {
      const response = await axios.delete(`'${import.meta.env.VITE_APP_API_URL}/data/jobs/delete'`, {
        data: {
          jobs: Array.from(selectedJobs),
          email: userData.email
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) throw new Error('Failed to delete jobs');
      setJobsData(prev => prev.filter(job => !selectedJobs.has(job.jobId)));
      setSelectedJobs(new Set());
      toast.success("Jobs deleted successfully");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete jobs');
    }
  };
  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter ||
      (job.date && new Date(job.date).toDateString() === dateFilter.toDateString());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    if (typeof salary === 'number') return `$${salary.toLocaleString()}`;
    return salary;
  };

  return (
    <>
      <Toaster position="center-top" />
      <Helmet>
        <title>Job Application Tracker | Zobly</title>
        <meta name="description" content="Track your job applications and keep an eye on saved job listings with Zobly's job status tracking feature." />
        <meta name="keywords" content="job application tracking, saved jobs, job status, career tracker, job search management, Zobly" />
        <meta name="author" content="Zobly" />
        <meta property="og:title" content="Job Application Tracker | Zobly" />
        <meta property="og:description" content="Track your job applications and keep an eye on saved job listings with Zobly's job status tracking feature." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.zobly.com/job-tracking" />
        <meta property="og:image" content="https://www.zobly.com/assets/job-tracker-banner.png" />
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <Button
            variant="destructive"
            onClick={() => { handleDelete() }}
            disabled={!selectedJobs.size}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>

        <Card className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search positions or companies..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {dateFilter && <X className="h-3 w-3" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {statusOptions.map(status => (
            <Card
              key={status.value}
              className="p-4 text-center transition-all hover:scale-[1.02] cursor-pointer"
              style={{ background: `linear-gradient(45deg, ${status.color}10, transparent)` }}
              onClick={() => setStatusFilter(status.value === "Saved"?"all":status.value)}
            >
              <div className="text-2xl font-bold text-foreground">
                {status.value === "Saved"
                  ? savedJobs.length
                  : jobsData.filter(job => job.status === status.value).length}
              </div>
              <div className="text-sm flex items-center justify-center gap-2" style={{ color: status.color }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                {status.label}
              </div>
            </Card>
          ))}

        </div>

        <Card className="shadow-lg">
  <div className="relative">
    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
      <Table className="min-w-[1000px]">
        <TableHeader className="bg-muted/50 sticky top-0 z-100">
          <TableRow>
            <TableHead className="w-[40px]">
              <input
                type="checkbox"
                checked={filteredJobs.length > 0 && filteredJobs.every(job => selectedJobs.has(job.jobId))}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 accent-primary translate-y-[2px]"
              />
            </TableHead>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Salary</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="scrollbar-hide">
          {filteredJobs.map(job => (
            <TableRow key={job.jobId || job._id} className="hover:bg-muted/10">
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedJobs.has(job.jobId)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedJobs(prev => {
                      const next = new Set(prev);
                      if (checked) next.add(job.jobId);
                      else next.delete(job.jobId);
                      return next;
                    });
                  }}
                  className="w-4 h-4 accent-primary"
                />
              </TableCell>
              <TableCell>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={job.logo} alt={job.company} />
                  <AvatarFallback>
                    {job.company?.slice(0, 2).toUpperCase() || "JP"}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{job.title}</span>
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View posting
                  </a>
                </div>
              </TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell className="text-right">{formatSalary(job.salary)}</TableCell>
              <TableCell>
                {job.date
                  ? new Date(job.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Select value={job.status || "Saved"} onValueChange={(value) => handleStatusChange(job.jobId, value)}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: statusOptions.find(s => s.value === (job.status || "Saved"))?.color,
                        }}
                      />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-muted/20">
                      <NotebookPen className="h-4 w-4 mr-2" />
                      Notes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={job.logo} />
                            <AvatarFallback>{job.company?.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{job.title}</div>
                            <div className="text-sm text-muted-foreground">{job.company}</div>
                          </div>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <Input
                        value={notes[job.jobId] ?? job.notes ?? ""}
                        onChange={(e) => setNotes(prev => ({ ...prev, [job.jobId]: e.target.value }))}
                        placeholder="Add private notes about this opportunity..."
                        className="min-h-[100px]"
                      />
                      <div className="text-sm text-muted-foreground">
                        These notes are only visible to you
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {filteredJobs.length === 0 && (
      <div className="p-8 text-center text-muted-foreground">
        <Search className="mx-auto h-8 w-8 mb-2" />
        <p>No jobs found matching your criteria</p>
      </div>
    )}
  </div>
</Card>

      </div>
    </>
  );
}