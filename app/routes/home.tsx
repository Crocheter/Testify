
 import React, {  useRef, useState } from 'react';
  
const home = () => {
 
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file');
    }
  } else {
    alert('No file selected.');
  }
};

  const handleUpload = async () => {
    if (!pdfFile) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await fetch('https://testify-backend-zxg4.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Server response:', data.questions);
      setQuizQuestions(data.questions);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

    const handleImageClick = () => {
    fileInputRef.current?.click(); // Programmatically click the hidden input
  };

  return (
    <div>
      <h1 className="mt-5 ml-10 text-5xl text-blue-700">TESTify</h1>
      <p className="ml-10">Test your knowledge</p>
      <div className="m-25 justify-items-center">
        <img className="w-35" src="../../upload-solid.svg" alt="" onClick={handleImageClick} />
        <h6 className="text-center m-3 text-5xl" onClick={handleImageClick}>Upload your PDF file</h6>
        <input className="hidden" ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} />
        {pdfFile && (
          <p className="ml-10 mt-2 text-gray-700">Selected PDF: {pdfFile.name}</p>
        )}
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Generate Questions
        </button>
      </div>
      <div className="mt-6 ml-10">
        {quizQuestions && quizQuestions.length > 0 && (
        <div>
          {quizQuestions.map((q, index) => (
            <div key={index}>
              <p>{q.question}</p>
              {q.options.map((option: string, i: number) => (
              <div key={i}>
                <input type="radio" name={`q-${index}`} value={option} />
                <label>{option}</label>
              </div>
              ))}
            </div>
          ))}
        </div>
        )}

      </div>

    </div>
  )
}

export default home