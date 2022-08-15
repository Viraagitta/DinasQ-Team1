const { jsPDF } = require("jspdf");

const generatePdf = (data) => {
    const doc = new jsPDF();
    doc.text("Reimbursement Report", 75, 10);
    doc.line(10, 19, 200, 19); 
    doc.line(10, 20, 200, 20); 

    doc.setFontSize(12);
    doc.text("Employee Name ", 20, 30);
    doc.text( ": "+data.OfficialLetter.User.firstName+ " " + data.OfficialLetter.User.lastName, 60, 30)
    doc.text("Activity ", 20, 40);
    doc.text(": " + data.OfficialLetter.activityName , 60, 40);
    doc.text("Category ", 20, 50);
    doc.text(": " + data.category , 60, 50);
    doc.text("From ", 20, 60);
    doc.text(": " + data.OfficialLetter.from , 60, 60);
    doc.text("To ", 20, 70);
    doc.text(": " + data.OfficialLetter.to, 60, 70);
    doc.text("Leave Date " , 20, 80);
    doc.text(": "  +data.OfficialLetter.leaveDate , 60, 80);
    doc.text("Return Date ", 20, 90);
    doc.text(": " +data.OfficialLetter.returnDate , 60, 90);
    
    doc.line(10, 100, 200, 100);

    doc.text("Cost ", 20, 110);
    doc.text(": Rp. " + (data.cost.toLocaleString()) +",-" + "  (" + data.status.toUpperCase() +")"  , 60, 110);

    doc.line(10, 115, 200, 115);
    doc.line(10, 116, 200, 116);

    doc.save("services/report.pdf");
}

module.exports = {generatePdf}