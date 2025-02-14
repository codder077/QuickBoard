import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TrainIcon from '@mui/icons-material/Train';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { motion } from 'framer-motion';

const TrainRoutePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { train } = location.state || {};

  if (!train) {
    return <div>No train data available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-yellow-400 hover:text-yellow-500 transition-colors mb-6"
        >
          <ArrowBackIcon className="mr-2" />
          Back to Search Results
        </button>

        {/* Train Info Header */}
        <div className="bg-black/50 backdrop-blur-sm border-2 border-yellow-400/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">{train.train_name}</h1>
              <p className="text-gray-300">Train No: {train.train_ID}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-gray-400">Departure</p>
                <p className="text-xl font-semibold text-yellow-400">{train.departureTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Arrival</p>
                <p className="text-xl font-semibold text-yellow-400">{train.arrivalTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="relative py-12 px-4">
          {/* Vertical line connecting all stations */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-400/30 transform -translate-x-1/2" />

          {/* Animated train icon */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-yellow-400 p-2 rounded-full shadow-lg shadow-yellow-400/50">
              <TrainIcon className="text-black text-3xl" />
            </div>
          </motion.div>

          {/* Station points */}
          {train.route.map((station, index) => (
            <div key={index} className="relative mb-16">
              <div className="flex items-center">
                {/* Station dot and connecting line */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-full" />
                  </div>
                </div>

                {/* Station details - alternating left and right */}
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
                  <div 
                    className={`bg-black/60 p-6 rounded-xl border border-yellow-400/30 
                      ${index % 2 === 0 ? 'mr-4' : 'ml-4'}
                      transform hover:scale-105 transition-transform duration-300
                      hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-400/20`}
                  >
                    <div className="flex items-center gap-2 mb-3 justify-start">
                      <LocationOnIcon className="text-yellow-400" />
                      <h3 className="text-xl font-bold text-yellow-400">{station.name}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AccessTimeIcon className="text-gray-400 text-sm" />
                        {station.arrivalTime ? (
                          <p className="text-white">
                            Arrival: <span className="text-yellow-400">{station.arrivalTime}</span>
                          </p>
                        ) : (
                          <p className="text-green-400 font-semibold">Starting Point</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <AccessTimeIcon className="text-gray-400 text-sm" />
                        {station.departureTime ? (
                          <p className="text-white">
                            Departure: <span className="text-yellow-400">{station.departureTime}</span>
                          </p>
                        ) : (
                          <p className="text-red-400 font-semibold">End Point</p>
                        )}
                      </div>

                      {station.haltTime && (
                        <div className="mt-2 inline-block bg-yellow-400/20 px-3 py-1 rounded-full">
                          <p className="text-yellow-400 text-sm">
                            {station.haltTime} mins halt
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainRoutePage; 