import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css"; 

// Define the chatbot decision tree structure
const chatbotTree = {
  RCM: {
    question: "Select below options:",
    options: [
      "Explore Audit complete items",
      "Explore Audit Pass items",
      "Explore Audit fail items",
      "Explore preceding not done items",
    ],
  },
  year: {
    question: "Select year:",
    options: ["2020", "2021", "2022", "2023", "2024", "2025"],
  },
  product: {
    question: "Select product type:",
    options: ["All", "CTV", "B2BTV", "SM", "BizTv"],
  },
  SCM: {
    question: "Select Product Year:",
    options: ["20", "21", "22", "23", "24", "25"],
  },
  rcYear: {
    question: "Select RC Year:",
    options: ["2020", "2021", "2022", "2023", "2024", "2025"],
  },
  rcMonth: {
    question: "Select RC Month:",
    options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
  }
};

const Chatbot = () => {
  // State to store chat history
  const [history, setHistory] = useState([]);
  // State to track the current step in the chatbot flow
  const [currentStep, setCurrentStep] = useState(null);
  // State to store the previous steps for back navigation
  const [previousSteps, setPreviousSteps] = useState([]);
  // State to track the selected mode (RCM or SCM)
  const [selectedMode, setSelectedMode] = useState(null);
  // State to store selected values in the chatbot flow
  const [selectedValues, setSelectedValues] = useState([]);
  // State to store subjects (used in subject selection)
  const [subjects, setSubjects] = useState([]);
  // Reference to scroll chat window to the latest message
  const chatEndRef = useRef(null);

  // Effect to auto-scroll chat to the latest message when history updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Function to fetch subjects (hardcoded for now, can be replaced with API call)
  const fetchSubjects = () => {
    setSubjects(["Sub1", "Sub2", "Sub3"]);
    setHistory((prev) => [...prev, { text: "Select a subject:", isUser: false }]);
  };

  // Function to handle selection of an option in the chatbot flow
  const handleSelect = (option, nextStep) => {
    setHistory([...history, { text: option, isUser: true }]); // Add user-selected option to chat history
    setSelectedValues([...selectedValues, option]); // Store the selected option

    if (nextStep) {
      // Move to the next step if defined
      setHistory((prev) => [...prev, { text: chatbotTree[nextStep].question, isUser: false }]);
      setPreviousSteps([...previousSteps, currentStep]); // Store the current step for back navigation
      setCurrentStep(nextStep);
    } else {
      // If no next step, fetch subjects as the final step
      fetchSubjects();
    }
  };

  // Function to handle subject selection (displays an alert with the selected subject)
  const handleSubjectSelect = (subject) => {
    alert(`Selected Subject: ${subject}`);
  };

  // Function to navigate back to the previous step
  const goBack = () => {
    if (previousSteps.length > 0) {
      const lastStep = previousSteps[previousSteps.length - 1];
      setPreviousSteps(previousSteps.slice(0, -1)); // Remove last step from history
      setCurrentStep(lastStep);
      setHistory(history.slice(0, -2)); // Remove last two messages (user input and bot response)
      setSelectedValues(selectedValues.slice(0, -1)); // Remove last selected value
    } else {
      // Reset chatbot if no previous steps exist
      setHistory([]);
      setCurrentStep(null);
      setPreviousSteps([]);
      setSelectedValues([]);
    }
  };

  // Function to handle mode selection (RCM or SCM)
  const selectMode = (mode) => {
    setSelectedMode(mode);
    setSubjects([]);
    setSelectedValues([]);
    setHistory([{ text: `${mode} selected`, isUser: false }]); // Display selected mode in chat

    if (mode === "RCM") {
      setCurrentStep("RCM"); // Start RCM flow
    } else {
      setCurrentStep(null); // Reset step first
      setTimeout(() => {
        setHistory((prev) => [...prev, { text: "Select Product Year", isUser: false }]);
        setCurrentStep("SCM"); // Start SCM flow
      }, 500); // Delay message before showing options
    }
  };

  return (
    <div className="chatbot-container">
      {/* RCM and SCM selection bar */}
      <div className="mode-selection">
        <button className={selectedMode === "RCM" ? "selected" : ""} onClick={() => selectMode("RCM")}>
          RCM
        </button>
        <button className={selectedMode === "SCM" ? "selected" : ""} onClick={() => selectMode("SCM")}>
          SCM
        </button>
      </div>

      {/* Chatbot window */}
      <div className="chatbot">
        <div className="chat-body">
          {history.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.isUser ? "user" : "bot"}`}>
              {msg.text}
            </div>
          ))}
          {subjects.length > 0 &&
            subjects.map((subject, index) => (
              <button key={index} className="subject-button" onClick={() => handleSubjectSelect(subject)}>
                {subject}
              </button>
            ))}
          <div ref={chatEndRef} />
        </div>

        {/* Options inside chat window */}
        {currentStep && chatbotTree[currentStep] && (
          <div className="chat-options">
            {chatbotTree[currentStep].options.map((option, index) => (
              <button key={index} onClick={() => handleSelect(option, Object.keys(chatbotTree)[Object.keys(chatbotTree).indexOf(currentStep) + 1])}>
                {option}
              </button>
            ))}
            <button className="go-back" onClick={goBack}>⬅ Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;