import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Zap, Lock } from 'lucide-react';

const Homepage = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-90" />
        <img
          src="https://images.unsplash.com/photo-1614292253389-bd2c1f89cd0e?auto=format&fit=crop&q=80&w=1920"
          alt="Background pattern"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative pt-24 pb-16 sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Visualize Ideas, <span className="text-indigo-600">Together</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create, collaborate, and bring your ideas to life with Melon's powerful diagramming tools. Real-time collaboration meets intuitive design.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Subtle Background */}
      <div className="relative bg-white py-24 sm:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=1920"
            alt="Diagram background"
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powerful features for modern teams
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Users className="h-5 w-5 flex-none text-indigo-600" />
                  Real-time Collaboration
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Work together in real-time with your team. See changes instantly and collaborate seamlessly.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Zap className="h-5 w-5 flex-none text-indigo-600" />
                  Powerful Diagramming
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Create professional diagrams with our intuitive tools. From flowcharts to mind maps, we've got you covered.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Lock className="h-5 w-5 flex-none text-indigo-600" />
                  Enterprise Security
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Your data is safe with us. Enterprise-grade security and compliance features built-in.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;