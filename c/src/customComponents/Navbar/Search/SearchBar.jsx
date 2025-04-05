import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Input } from '../../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Search, Sparkles, Command, RotateCw, Briefcase, MapPin, Building, SearchIcon } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { useJobData } from '../../../Context/jobDataProvider';
import { useDebounce } from '../../../hooks/useDebounce';

const createWorker = () => new Worker(new URL('./searchWorker.js', import.meta.url));

const JobItem = React.memo(({ job }) => (
  <div className="group p-4 rounded-xl border bg-background/95 backdrop-blur-sm 
                 hover:bg-accent transition-all cursor-pointer shadow-sm
                 hover:shadow-md hover:border-primary/20 active:scale-[0.99]
                 transform duration-200 hover:-translate-y-0.5"
       role="button"
       tabIndex={0}>
    <div className="flex items-start gap-4">
      <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
        <Briefcase className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-grow space-y-2">
        <h4 className="font-semibold text-base line-clamp-1">{job.title}</h4>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building className="h-4 w-4" />
            <span className="truncate">{job.company}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>
        {job.skills && (
          <div className="flex flex-wrap gap-2 mt-2">
            {job.skills.map((skill) => (
              <Badge key={skill}
                     variant="secondary"
                     className="px-2 py-0.5 text-xs bg-primary/5 text-primary/80">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
));

const SkeletonLoader = () => (
  <div className="space-y-3 pr-2 pb-4">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="p-4 rounded-xl border bg-background/95 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-muted/50" />
          <div className="flex-grow space-y-2">
            <div className="h-5 w-3/4 rounded bg-muted/50" />
            <div className="flex gap-4">
              <div className="h-4 w-1/4 rounded bg-muted/50" />
              <div className="h-4 w-1/4 rounded bg-muted/50" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SearchBar = ({ variant = 'desktop' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { jobs } = useJobData();
  const workerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 200);
  const virtuosoRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const worker = createWorker();
    workerRef.current = worker;
    
    const handleMessage = ({ data }) => {
      setSearchResults(data);
      setIsLoading(false);
      virtuosoRef.current?.scrollToIndex(0);
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage({ type: 'INIT', jobs });

    return () => {
      worker.removeEventListener('message', handleMessage);
      worker.terminate();
    };
  }, [isOpen, jobs]);

  useEffect(() => {
    if (!workerRef.current) return;
    if (!debouncedQuery.trim()) return setSearchResults([]);
    
    setIsLoading(true);
    workerRef.current.postMessage({ type: 'SEARCH', query: debouncedQuery });
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleOpenChange = useCallback((open) => {
    setIsOpen(open);
    if (!open) {
      setQuery('');
      setSearchResults([]);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === 'mobile' ? (
          <Button className="md:hidden fixed bottom-4 right-4 z-50 rounded-full shadow-lg p-3 h-auto"
                  aria-label="Open mobile search">
            <SearchIcon className="h-5 w-5" />
          </Button>
        ) : (
          <div className="hidden md:block relative w-full max-w-2xl">
            <Input
              placeholder="Ask AI to find your next job..."
              className="pl-12 pr-28 rounded-full bg-background/95 backdrop-blur-sm 
                        ring-1 ring-border/50 cursor-text h-12 shadow-lg text-base"
              readOnly
              aria-label="Open AI-powered search"
            />
            <div className="absolute inset-y-0 left-4 flex items-center">
              <Search className="h-5 w-5 text-foreground/60" />
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center">
              <Badge variant="outline"
                     className="px-2.5 py-1 text-xs font-mono bg-background/90">
                {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
              </Badge>
            </div>
          </div>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-w-[95vw] md:max-w-3xl p-0 h-[90dvh] sm:h-[80dvh] rounded-2xl">
        <div className="h-full flex flex-col bg-background/95 backdrop-blur-lg">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              <div className="flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-primary" />
                <span>AI Job Search</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col h-full p-6 gap-4">
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: 'Remote React developer jobs with stock options'"
                className="pl-12 pr-24 rounded-xl py-5 text-base border-primary/20"
                autoFocus
                aria-label="AI search input"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/80" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 items-center">
                {isLoading && <RotateCw className="h-4 w-4 animate-spin text-muted-foreground" />}
                <Badge variant="outline" className="px-2 py-0.5 text-xs border-primary/20">
                  {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
                </Badge>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {isLoading ? (
                <SkeletonLoader />
              ) : searchResults.length > 0 ? (
                <Virtuoso
                  ref={virtuosoRef}
                  data={searchResults}
                  totalCount={searchResults.length}
                  itemContent={(index, job) => <JobItem job={job} />}
                  components={{ List: React.forwardRef(({ style, children }, ref) => (
                    <div ref={ref} style={style} className="pr-2 pb-4 space-y-3">
                      {children}
                    </div>
                  ))}}
                  className="scroll-container"
                />
              ) : query ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Search className="h-12 w-12 text-primary/30" />
                  <p className="text-lg font-medium text-foreground/80">
                    No matches found
                  </p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Start typing to search {jobs.length.toLocaleString()} opportunities
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(SearchBar);