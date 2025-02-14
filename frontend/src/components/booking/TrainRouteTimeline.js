import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TrainIcon from '@mui/icons-material/Train';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { motion } from 'framer-motion';

const TrainRouteTimeline = ({ open, handleClose, route, trainName, trainId, departureTime, arrivalTime }) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid rgba(250, 204, 21, 0.3)',
          borderRadius: '16px',
          backdropFilter: 'blur(8px)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle className="border-b border-yellow-400/30">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">{trainName}</h2>
            <p className="text-gray-300 text-sm">Train No: {trainId}</p>
          </div>
          <div className="flex items-center gap-8 mr-12">
            <div>
              <p className="text-sm text-gray-400">Departure</p>
              <p className="text-lg font-semibold text-yellow-400">{departureTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Arrival</p>
              <p className="text-lg font-semibold text-yellow-400">{arrivalTime}</p>
            </div>
          </div>
          <IconButton onClick={handleClose} className="absolute right-4 top-4">
            <CloseIcon className="text-yellow-400" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent className="relative">
        <div className="py-8 px-4">
          {/* Vertical line connecting all stations */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-400/30 transform -translate-x-1/2" />

          {/* Animated train icon moving along the vertical line */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 'calc(100vh - 120px)' }} // changed to 100vh to make it move along the full height of the dialog
            transition={{
              duration: 3, // dynamically update duration based on the sum of all station durations
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute left-1/2 transform translate-y-1/2 z-10"
          >
            <div className="bg-yellow-400 p-2 rounded-full shadow-lg shadow-yellow-400/50">
              <TrainIcon className="text-black text-3xl" />
            </div>
          </motion.div>

          {/* Station points */}
          {route.map((stationData, index) => {
            const station = stationData.station; // Accessing the station object
            return (
              <div key={index} className="relative mb-16">
                <div className="flex items-center">
                  {/* Station dot */}
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
                          {stationData.arrivalTime ? (
                            <p className="text-white">
                              Arrival: <span className="text-yellow-400">{stationData.arrivalTime}</span>
                            </p>
                          ) : (
                            <p className="text-green-400 font-semibold">Starting Point</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <AccessTimeIcon className="text-gray-400 text-sm" />
                          {stationData.departureTime ? (
                            <p className="text-white">
                              Departure: <span className="text-yellow-400">{stationData.departureTime}</span>
                            </p>
                          ) : (
                            <p className="text-red-400 font-semibold">End Point</p>
                          )}
                        </div>

                        {stationData.haltTime && (
                          <div className="mt-2 inline-block bg-yellow-400/20 px-3 py-1 rounded-full">
                            <p className="text-yellow-400 text-sm">
                              {stationData.haltTime} mins halt
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainRouteTimeline; 