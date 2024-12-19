import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const WaitingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requestStatus, setRequestStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (!user || !roomId) return;

    const q = query(
      collection(db, 'meetingRequests'),
      where('meetingId', '==', roomId),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        const status = doc.data().status;
        setRequestStatus(status);

        if (status === 'approved') {
          // Redirect to meeting room after a short delay
          setTimeout(() => {
            navigate(`/meeting/${roomId}`);
          }, 1500);
        }
      });
    });

    return () => unsubscribe();
  }, [user, roomId, navigate]);

  const getStatusContent = () => {
    switch (requestStatus) {
      case 'pending':
        return {
          icon: <Clock className="w-12 h-12 text-yellow-500" />,
          title: 'Waiting for approval',
          message: 'Your request to join the meeting is being reviewed',
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          title: 'Request approved!',
          message: 'You will be redirected to the meeting room shortly',
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          title: 'Request declined',
          message: 'Your request to join the meeting was declined',
        };
      default:
        return {
          icon: <Clock className="w-12 h-12 text-yellow-500" />,
          title: 'Processing',
          message: 'Please wait...',
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-4">{content.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-600">{content.message}</p>
        
        {requestStatus === 'rejected' && (
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Return to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;