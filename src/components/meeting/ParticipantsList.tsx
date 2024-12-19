import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Check, X, UserPlus, Copy, CheckCircle } from 'lucide-react';

interface JoinRequest {
  id: string;
  userId: string;
  displayName: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
}

interface ParticipantsListProps {
  roomId: string;
  currentUser: User;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ roomId, currentUser }) => {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [showRequests, setShowRequests] = useState(false);
  const [copied, setCopied] = useState(false);
  const meetingUrl = `${window.location.origin}/meeting/join/${roomId}`;

  useEffect(() => {
    const q = query(
      collection(db, 'meetingRequests'),
      where('meetingId', '==', roomId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests: JoinRequest[] = [];
      snapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() } as JoinRequest);
      });
      setJoinRequests(requests);
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleRequestAction = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'meetingRequests', requestId), {
        status,
        updatedAt: new Date(),
        updatedBy: currentUser.uid
      });
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Participants</h3>
        <button
          onClick={() => setShowRequests(!showRequests)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
        >
          <UserPlus className="w-4 h-4 mr-1" />
          {showRequests ? 'Hide Requests' : 'Show Requests'}
        </button>
      </div>

      {/* Invite Link Section */}
      <div className="border rounded-md p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Invite Link</span>
          <button
            onClick={copyMeetingLink}
            className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <Copy className="w-4 h-4 mr-1" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <input
          type="text"
          value={meetingUrl}
          readOnly
          className="w-full px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Join Requests Section */}
      {showRequests && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Join Requests</h4>
          {joinRequests.length === 0 ? (
            <p className="text-sm text-gray-500">No pending requests</p>
          ) : (
            <div className="space-y-2">
              {joinRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium">{request.displayName}</p>
                    <p className="text-sm text-gray-500">
                      {request.status === 'pending' ? 'Waiting to join' : request.status}
                    </p>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRequestAction(request.id, 'approved')}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'rejected')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;