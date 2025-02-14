import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const Faq = () => {
  return (
    <section className="bg-black/90">
      <div className="container px-6 py-10 mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-yellow-400 capitalize lg:text-4xl">
            Frequently Asked
            <span className="mx-3 text-white">Questions</span>
          </h2>
        </div>

        <div className="w-full max-w-4xl mx-auto mt-8 space-y-4">
          <Accordion className="border-2 border-yellow-400 !bg-gray-900/90 backdrop-blur-sm">
            <AccordionSummary
              expandIcon={<AddCircleIcon className="text-yellow-400" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>
                <p className="font-semibold text-yellow-400 text-xl">
                  What is QuickBoard?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-yellow-100">
                QuickBoard is a feature that allows users to seamlessly board
                their train or flight by providing quick access to their
                boarding passes or tickets directly from their mobile device,
                reducing the need for paper tickets and streamlining the
                boarding process.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className="border-2 border-yellow-400 !bg-gray-900/90 backdrop-blur-sm">
            <AccordionSummary
              expandIcon={<AddCircleIcon className="text-yellow-400" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <p className="font-semibold text-yellow-400 text-xl">
                  How does predictive ticketing work?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-yellow-100">
                Predictive ticketing utilizes advanced algorithms to forecast
                train delays and flight cancellations based on historical data
                and real-time factors. This enables users to make informed
                decisions about their travel plans.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className="border-2 border-yellow-400 !bg-gray-900/90 backdrop-blur-sm">
            <AccordionSummary
              expandIcon={<AddCircleIcon className="text-yellow-400" />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography>
                <p className="font-semibold text-yellow-400 text-xl">
                  How does real-time ticket allocation benefit users?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-yellow-100">
                Real-time ticket allocation automatically assigns cancelled
                tickets to users on the waiting list, reducing wait times and
                ensuring fair distribution of tickets.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className="border-2 border-yellow-400 !bg-gray-900/90 backdrop-blur-sm">
            <AccordionSummary
              expandIcon={<AddCircleIcon className="text-yellow-400" />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              <Typography>
                <p className="font-semibold text-yellow-400 text-xl">
                  What is the full refund guarantee?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-yellow-100">
                Our full refund guarantee ensures that users receive a full
                refund for cancelled tickets if their tickets are successfully
                sold to someone on the waiting list, mitigating financial risks
                for travelers.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className="border-2 border-yellow-400 !bg-gray-900/90 backdrop-blur-sm">
            <AccordionSummary
              expandIcon={<AddCircleIcon className="text-yellow-400" />}
              aria-controls="panel5-content"
              id="panel5-header"
            >
              <Typography>
                <p className="font-semibold text-yellow-400 text-xl">
                  How does the fair pricing policy work?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-yellow-100">
                Our fair pricing policy prevents booking tickets at excessively
                high prices, particularly within one day of travel, promoting
                affordability and accessibility for all users.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className="border-2 border-yellow-400 !bg-gray-900/90 backdrop-blur-sm">
            <AccordionSummary
              expandIcon={<AddCircleIcon className="text-yellow-400" />}
              aria-controls="panel6-content"
              id="panel6-header"
            >
              <Typography>
                <p className="font-semibold text-yellow-400 text-xl">
                  How are train and flight schedules updated?
                </p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-yellow-100">
                Train and flight schedules are updated in real-time using
                reliable sources, allowing users to stay informed about changes
                and adjust their plans accordingly.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;
