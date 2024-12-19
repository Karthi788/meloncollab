import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Peer from 'simple-peer';
import { useAuth } from '../context/AuthContext';
import { Video, Mic, MicOff, VideoOff, Phone, Share, Users, Copy, Check, AlertCircle, Maximize, Minimize } from 'lucide-react';
import ParticipantsList from '../components/meeting/ParticipantsList';

interface PeerConnection {
  peerId: string;
  peer: Peer.Instance;
  stream?: MediaStream;
}

const Meeting = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false); // State to track full-screen mode
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null); // For remote video

  // Generate meeting URL
  const meetingUrl = `${window.location.origin}/meeting/${roomId}`;

  const initializeMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideo = devices.some(device => device.kind === 'videoinput');
      const hasAudio = devices.some(device => device.kind === 'audioinput');

      if (!hasVideo && !hasAudio) {
        throw new Error('No camera or microphone found. Please connect a device and try again.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: hasVideo,
        audio: hasAudio
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setLocalStream(stream);
      setIsVideoEnabled(hasVideo);
      setIsAudioEnabled(hasAudio);
      setError(null);
    } catch (err: any) {
      let errorMessage = 'Failed to access media devices.';
      if (err.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found. Please connect a device and try again.';
      } else if (err.name === 'NotAllowedError') {
        errorMessage = 'Please allow access to your camera and microphone to join the meeting.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Your camera or microphone is already in use by another application.';
      }

      setError(errorMessage);
      setIsVideoEnabled(false);
      setIsAudioEnabled(false);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    initializeMediaDevices();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user, navigate]);

  const toggleAudio = async () => {
    if (!localStream) {
      await initializeMediaDevices();
      return;
    }

    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    } else {
      setError('No microphone available');
    }
  };

  const toggleVideo = async () => {
    if (!localStream) {
      await initializeMediaDevices();
      return;
    }

    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length > 0) {
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    } else {
      setError('No camera available');
    }
  };

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy meeting link');
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: false
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      screenStream.getVideoTracks()[0].onended = () => {
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      };

      setError(null);
    } catch (err) {
      setError('Failed to start screen sharing');
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    peers.forEach(peer => peer.peer.destroy());
    navigate('/dashboard');
  };

  // Toggle full-screen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={`min-h-screen pt-16 bg-gray-900 ${isFullScreen ? 'h-screen' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-4">
            {/* Main Content */}
            <div className={`flex-1 ${isFullScreen ? 'h-full' : ''}`}>
              {/* Room Info */}
              <div className="mb-6 flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-xl font-semibold">Meeting Room: {roomId}</h2>
                  <p className="text-gray-400 text-sm">
                    {peers.length + 1} participant{peers.length !== 0 ? 's' : ''}
                  </p>
                </div>

                {/* Full-Screen Button */}
                <button onClick={toggleFullScreen} className="text-white p-2 rounded-full">
                  {isFullScreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </button>
              </div>

              {/* Video Grid */}
              <div className={`grid gap-4 mb-20 ${peers.length === 0 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                {/* Local Video */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  {isVideoEnabled ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <div className="text-white text-center">
                        <VideoOff className="w-12 h-12 mx-auto mb-2" />
                        <p>Camera is off</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                    You {!isAudioEnabled && '(muted)'}
                  </div>
                </div>
                {/* Remote Videos */}
                {peers.map(peer => (
                  <div key={peer.peerId} className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                      autoPlay
                      playsInline
                      ref={remoteVideoRef}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      Participant
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participants Sidebar */}
            <div className="w-80 flex-shrink-0">
              {user && roomId && <ParticipantsList roomId={roomId} currentUser={user} />}
            </div>
          </div>

          {/* Controls */}
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-full transition-colors ${isAudioEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
                title={isAudioEnabled ? 'Mute' : 'Unmute'}
              >
                {isAudioEnabled ? (
                  <Mic className="w-6 h-6 text-white" />
                ) : (
                  <MicOff className="w-6 h-6 text-white" />
                )}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-colors ${isVideoEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
                title={isVideoEnabled ? 'Stop Camera' : 'Start Camera'}
              >
                {isVideoEnabled ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <VideoOff className="w-6 h-6 text-white" />
                )}
              </button>
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                title="End Call"
              >
                <Phone className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={shareScreen}
                className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
                title="Share Screen"
              >
                <Share className="w-6 h-6 text-white" />
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meeting;
