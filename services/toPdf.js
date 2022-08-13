const { jsPDF } = require("jspdf");

// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF();

doc.text("Hello worlddd!", 10, 10);
doc.save("a4.pdf");