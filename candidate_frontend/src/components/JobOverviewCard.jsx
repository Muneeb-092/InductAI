import { MapPin, Briefcase, Users, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

export function JobOverviewCard() {
  const [expanded, setExpanded] = useState(false);
  
  const jobDescription = "We are seeking a talented Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications, working with modern technologies, and collaborating with cross-functional teams to deliver high-quality solutions. The ideal candidate should have strong problem-solving skills and a passion for creating exceptional user experiences.";

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Full Stack Developer
          </h2>
          <p className="text-lg text-gray-600">TechCorp Solutions</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Job Type</p>
              <p className="text-gray-900">Hybrid</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Experience Required</p>
              <p className="text-gray-900">2–4 years</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <Users className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Gender Preference</p>
              <p className="text-gray-900">Any</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Age Range</p>
              <p className="text-gray-900">22–35 years</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Job Description</h3>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              {expanded ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Read More <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          <p className={`text-sm text-gray-600 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {jobDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
            React
          </Badge>
          <Badge variant="secondary" className="bg-cyan-50 text-cyan-700 border-cyan-200">
            Node.js
          </Badge>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
            TypeScript
          </Badge>
          <Badge variant="secondary" className="bg-cyan-50 text-cyan-700 border-cyan-200">
            MongoDB
          </Badge>
        </div>
      </div>
    </Card>
  );
}
