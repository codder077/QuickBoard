import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const Faq = () => {
  return (
    <div className="flex mt-12 flex-col my-[3rem]">
      <div className="flex flex-col gap-[0.2rem] text-4xl font-bold text-center mx-auto items-center mb-[1rem]">
        <h3 className="text-bold text-4xl underline-offset-4">
          Frequently Asked Questions
        </h3>
        <div className="h-[0.2rem] mt-2 w-[30rem] bg-[#2874fc]" />
      </div>
      <div>
        <div className="w-[80%] mx-auto mt-4 flex flex-col gap-[1rem]">
          <Accordion className="border-2 border-blue-300">
            <AccordionSummary
              expandIcon={<AddCircleIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <p className="font-bold yantramanav-regular text-[1.3rem]">
                  What is QuickBoard ?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-gray-500 ">
                QuickBoard is a feature that allows users to seamlessly board
                their train or flight by providing quick access to their
                boarding passes or tickets directly from their mobile device,
                reducing the need for paper tickets and streamlining the
                boarding process.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="border-2 border-blue-300">
            <AccordionSummary
              expandIcon={<AddCircleIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <p className="font-bold yantramanav-regular text-[1.3rem]">
                  How does predictive ticketing work?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-gray-500 ">
                Predictive ticketing utilizes advanced algorithms to forecast
                train delays and flight cancellations based on historical data
                and real-time factors. This enables users to make informed
                decisions about their travel plans.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="border-2 border-blue-300">
            <AccordionSummary
              expandIcon={<AddCircleIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <p className="font-bold yantramanav-regular text-[1.3rem]">
                  How does real-time ticket allocation benefit users?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-gray-500 ">
                Real-time ticket allocation automatically assigns cancelled
                tickets to users on the waiting list, reducing wait times and
                ensuring fair distribution of tickets.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="border-2 border-blue-300">
            <AccordionSummary
              expandIcon={<AddCircleIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <p className="font-bold yantramanav-regular text-[1.3rem]">
                  What is the full refund guarantee?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-gray-500 ">
                Our full refund guarantee ensures that users receive a full
                refund for cancelled tickets if their tickets are successfully
                sold to someone on the waiting list, mitigating financial risks
                for travelers.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="border-2 border-blue-300">
            <AccordionSummary
              expandIcon={<AddCircleIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <p className="font-bold yantramanav-regular text-[1.3rem]">
                  How does the fair pricing policy work ?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-gray-500 ">
                Our fair pricing policy prevents booking tickets at excessively
                high prices, particularly within one day of travel, promoting
                affordability and accessibility for all users.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="border-2 border-blue-300">
            <AccordionSummary
              expandIcon={<AddCircleIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <p className="font-bold yantramanav-regular text-[1.3rem]">
                  How are train and flight schedules updated ?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="font-bold yantramanav-regular text-[1.3rem]">
                Train and flight schedules are updated in real-time using
                reliable sources, allowing users to stay informed about changes
                and adjust their plans accordingly.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Faq;
