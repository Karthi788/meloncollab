import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FlowchartEditor from '../components/flowchart/FlowchartEditor';
import Whiteboard from '../components/whiteboard/Whiteboard';
import { GitBranch, PenTool } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'flowchart' | 'whiteboard'>('flowchart');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Please log in to access the dashboard</h2>
          <p className="mt-2 text-gray-600">You need to be authenticated to view this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="h-full">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('flowchart')}
                className={`${
                  activeTab === 'flowchart'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <GitBranch className="mr-2 h-5 w-5" />
                Flowchart Editor
              </button>
              <button
                onClick={() => setActiveTab('whiteboard')}
                className={`${
                  activeTab === 'whiteboard'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <PenTool className="mr-2 h-5 w-5" />
                Whiteboard
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[calc(100vh-8rem)]">
          {activeTab === 'flowchart' ? (
            <div className="h-full">
              <FlowchartEditor />
            </div>
          ) : (
            <div className="h-full">
              <Whiteboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;