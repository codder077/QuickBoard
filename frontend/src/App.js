import "./App.css";
import Abouts from "./components/about/About";
import FlightBookingPage from "./components/booking/FlightBookingPage";
import TrainBookingPage from "./components/booking/TrainBookingPage";
import FlightCancelPage from "./components/cancel/FlightCancelPage";
import TrainCancelPage from "./components/cancel/TrainCancelPage";
import Contact from "./components/contact/Contact";
import Faq from "./components/faq/faq";
import Features from "./components/features/Features";
import Hero from "./components/hero/Hero";
import Services from "./components/services/Services";
import Login from "./components/signin/Login";
import SignUp from "./components/signup/Signup";
import Tagline from "./components/tagline/Tagline";
import Dashboard from "./components/dashboard/dashboard";
import TrainRoutePage from './pages/TrainRoutePage';
import Details from './components/details/details';
import Allowance from './components/whyus/allowance';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <Hero />
              <Tagline />
              <Features />
              <Services />
              <Faq/>
            </>
          }
        />
        <Route exact path="/signup" element={<SignUp/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/about" element={<Abouts />} />
        <Route exact path="/trainbooking" element={<TrainBookingPage />} />
        <Route exact path="/flightbooking" element={<FlightBookingPage />} />
        <Route exact path="/traincancel" element={<TrainCancelPage />} />
        <Route exact path="/flightcancel" element={<FlightCancelPage />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route path="/train-route" element={<TrainRoutePage />} />
        <Route path="/details" element={<Details />} />
        <Route path="/allowance" element={<Allowance />} />
      </Routes>
    </>
  );
}

export default App;
