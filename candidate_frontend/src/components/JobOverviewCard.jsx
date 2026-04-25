import { MapPin, Briefcase, Users, Calendar, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

export function JobOverviewCard() {
  const { jobId } = useParams(); // Grabs the ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        const data = await response.json();
        
        if (data.success) {
          setJob(data.data);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <Card className="p-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </Card>
    );
  }

  if (!job) {
    return <Card className="p-6 text-center text-gray-500">Job details not found.</Card>;
  }

  return (
    <Card className="p-6 bg-white shadow-lg border-none">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {job.title}
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            {job.recruiter?.organization || "Hiring Company"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Job Type</p>
              <p className="text-gray-900 capitalize">{job.jobType}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Experience</p>
              <p className="text-gray-900">{job.experience} Years</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <Users className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Gender</p>
              <p className="text-gray-900 capitalize">{job.gender || "Any"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Age Range</p>
              <p className="text-gray-900">
                {job.minAge && job.maxAge ? `${job.minAge}-${job.maxAge} years` : "No preference"}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Job Description</h3>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              {expanded ? 'Show Less' : 'Read More'}
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          <p className={`text-sm text-gray-600 leading-relaxed transition-all ${expanded ? '' : 'line-clamp-2'}`}>
            {job.description}
          </p>
        </div>

        {/* Dynamic Skills Mapping */}
        <div className="flex flex-wrap gap-2 pt-2">
          {job.skills?.map((s, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`border-none ${index % 2 === 0 ? 'bg-purple-50 text-purple-700' : 'bg-cyan-50 text-cyan-700'}`}
            >
              {s.skill?.name || s.name}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}