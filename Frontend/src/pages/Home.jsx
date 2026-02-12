// import React from "react";
// import { Link } from "react-router-dom";
// import { Stethoscope } from "lucide-react";

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center text-center px-6">
      
//       {/* Logo Section */}
//       <div
//         className="flex items-center gap-3 mb-6"
//       >
//         <Stethoscope className="w-10 h-10 text-blue-600" />
//         <h1 className="text-3xl sm:text-4xl font-bold text-blue-700">
//           RDLINet Lung Sound Analysis
//         </h1>
//       </div>

//       {/* Subtitle */}
//       <p className="text-gray-700 max-w-2xl text-lg sm:text-xl mb-8"
//       >
//         An AI-powered system for early detection of respiratory abnormalities through lung sound analysis.
//       </p>

//       {/* Buttons */}
//       <div className="flex gap-6">
//         <Link
//           to="/login"
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-all"
//         >
//           Login
//         </Link>

//         <Link
//           to="/register"
//           className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-2xl shadow-md transition-all"
//         >
//           Sign Up
//         </Link>

//         <Link
//           to="/about"
//           className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-2xl shadow-md transition-all"
//         >
//           Learn More
//         </Link>
//       </div>

//     </div>
//   );
// };

// export default Home;



import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Activity, Wind, ShieldCheck, HeartPulse, Info, LineChart, Ear, Microscope } from "lucide-react";
import soundwaveimg from '../assets/img/soundwaveimg.jpg'
import hom from '../assets/img/hom.webp'
import dopat from '../assets/img/dopat.jpg'

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <img src={soundwaveimg} alt="" className="w-15 h-8 "/>
          <span className="font-bold text-xl text-blue-800 tracking-tight">RHMS</span>
        </div>
        <div className="flex gap-8">
          <Link to="/login" className="text-slate-600 py-2 hover:text-blue-600 font-medium transition">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">Sign Up</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 to-white flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <Activity size={16} />
          Deep Learning Powered Respiratory Analysis
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
          Precision Detection for <br /> <span className="text-blue-600">Respiratory Health</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mb-10">
          RHMS uses advanced neural networks to analyze lung sounds, identifying abnormalities that the human ear might miss. Fast, non-invasive, and accurate.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1">
            Start Diagnosis Now
          </Link>
          <a href="#info" className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
            How it Works
          </a>
        </div>
      </section>

      {/* KEY ROLE & SCIENCE SECTION */}
      {/* MAIN INFORMATIONAL SECTION - COMBINED AND ENHANCED */}
      <section id="info" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="space-y-24">
          <div className="flex flex-row gap-8">
          {/* Left Column: Importance of Respiratory Health */}
          <div>
            <h2 className="text-4xl font-extrabold mb-8 text-slate-900 leading-snug">
              Why Your Respiratory Health <span className="text-blue-600">Truly Matters</span>
            </h2>
            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              Often overlooked, your respiratory system is the cornerstone of your overall well-being. It's not just about breathing; it's about vitality, energy, and protecting your entire body.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <HeartPulse className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Fueling Every Cell</h3>
                  <p className="text-slate-600 mt-1">
                    Your lungs efficiently deliver oxygen to every organ, muscle, and tissue. Optimal respiratory function is directly linked to energy levels, cognitive performance, and physical endurance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Your Body's Defense</h3>
                  <p className="text-slate-600 mt-1">
                    Healthy airways are crucial for filtering out pollutants, allergens, and pathogens. A robust respiratory system is your first line of defense against infections and environmental damage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <LineChart className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Long-Term Wellness</h3>
                  <p className="text-slate-600 mt-1">
                    Chronic respiratory conditions can severely impact quality of life. Early detection and proactive care are essential for preventing irreversible damage and maintaining independence.
                  </p>
                </div>
              </div>
            </div>
          </div>

              <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={hom}
                  alt="Stethoscope listening to chest"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
        </div>
          {/* Right Column: Respiratory Sounds & DL Advantage */}
          <div>
            <div className="flex items-center gap-10 max-w-6xl mx-auto px-6 py-12">

                {/* Image - Left */}
                <div className="w-1/2">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <img
                        src={dopat}
                        alt="Mel-Spectrogram of lung sound"
                        className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                  {/* Content - Right */}
  <div className="w-1/2 text-right">
    <h2 className="text-4xl font-extrabold mb-6 text-slate-900 leading-snug">
      The Silent Language of Your Lungs: 
      <span className="text-blue-600"> Acoustic Biomarkers</span>
    </h2>

    <p className="text-lg text-slate-700">
      Every breath you take creates subtle sounds. These respiratory sounds are not just background noise; they are rich data points, carrying vital information about the health of your airways and lung tissue.
    </p>

    <p className="text-slate-700 text-lg mt-4">
      From the gentle rustle of healthy air exchange to the distinct wheezing of narrowed airways or the crackling of fluid-filled alveoli, each sound tells a story.
    </p>

    <p className="text-slate-700 text-lg mt-4">
      Our advanced Deep Learning system acts like a digital stethoscope, converting raw audio into Mel-Spectrograms — visual representations where patterns directly correlate to lung conditions.
    </p>
  </div>

</div>

            <div className="flex flex-row gap-5">
              <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center shrink-0">
                  <Microscope className="text-blue-700 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">The Power of Pattern Recognition</h3>
                  <p className="text-slate-600 mt-1">
                    AI models are trained on vast datasets of respiratory sounds to identify subtle anomalies, distinguishing between normal and abnormal patterns with incredible accuracy, far beyond human auditory capability.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-green-50 rounded-lg border border-green-100 shadow-sm">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center shrink-0">
                  <Ear className="text-green-700 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Early Warning System</h3>
                  <p className="text-slate-600 mt-1">
                    By consistently analyzing these acoustic biomarkers, RDLINet can detect early signs of conditions like asthma exacerbations, COPD progression, or developing infections, enabling timely intervention.
                  </p>
                </div>
              </div>
              </div>
            
          </div>
        </div>
      </section>



      {/* TYPES OF SOUNDS TABLE */}
      <section className="py-20 bg-slate-100 px-6">
  <div className="max-w-5xl mx-auto text-center mb-12">
    <h2 className="text-3xl font-bold mb-4">Decoding Lung Sounds</h2>
    <p className="text-slate-600">
      Your lungs speak a language. Here is what they are saying:
    </p>
  </div>

  <div className="max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg bg-white">
    <table className="w-full text-left border-collapse">
      <thead className="bg-blue-800 text-white">
        <tr>
          <th className="p-4">Sound Type</th>
          <th className="p-4">Characteristics</th>
          <th className="p-4">Indication</th>
        </tr>
      </thead>

      <tbody>
        <tr className="border-b border-slate-100">
          <td className="p-4 font-bold">Vesicular (Normal)</td>
          <td className="p-4">Soft, low-pitched, breezy breathing sounds.</td>
          <td className="p-4 text-green-600 font-medium">Healthy Lung Function</td>
        </tr>

        <tr className="border-b border-slate-100 bg-slate-50/50">
          <td className="p-4 font-bold">Wheezes</td>
          <td className="p-4">High-pitched, musical whistling sounds.</td>
          <td className="p-4 text-orange-600 font-medium">Asthma, COPD</td>
        </tr>

        <tr className="border-b border-slate-100">
          <td className="p-4 font-bold">Crackles (Rales)</td>
          <td className="p-4">Fine popping or crackling sounds.</td>
          <td className="p-4 text-red-600 font-medium">
            Pneumonia, Heart Failure
          </td>
        </tr>

        <tr className="border-b border-slate-100 bg-slate-50/50">
          <td className="p-4 font-bold">Rhonchi</td>
          <td className="p-4">Low-pitched, snoring or gurgling sounds.</td>
          <td className="p-4 text-red-600 font-medium">Bronchitis, Airway Blockage</td>
        </tr>

        <tr className="border-b border-slate-100">
          <td className="p-4 font-bold">Stridor</td>
          <td className="p-4">Loud, harsh, high-pitched sound on inhalation.</td>
          <td className="p-4 text-red-600 font-medium">
            Upper Airway Obstruction
          </td>
        </tr>

        <tr className="border-b border-slate-100 bg-slate-50/50">
          <td className="p-4 font-bold">Pleural Rub</td>
          <td className="p-4">Grating or creaking sound with breathing.</td>
          <td className="p-4 text-red-600 font-medium">
            Pleural Inflammation
          </td>
        </tr>

        <tr>
          <td className="p-4 font-bold">Mixed / Abnormal Sounds</td>
          <td className="p-4">
            Combination of multiple abnormal lung sounds.
          </td>
          <td className="p-4 text-red-700 font-semibold">
            Complex Respiratory Condition
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>


      {/* MAINTENANCE SECTION */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Lung Maintenance & Health</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
            <Wind className="text-blue-500 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">Air Quality</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Avoid pollutants and secondhand smoke. Use air purifiers during high AQI days to reduce inflammation.</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
            <HeartPulse className="text-red-500 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">Breathing Exercises</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Practice diaphragmatic breathing to increase oxygen exchange and lung capacity.</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
            <Activity className="text-green-500 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">Regular Cardio</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Aerobic exercise forces the lungs to work harder, making them stronger and more efficient over time.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center">
        <p className="mb-4">© 2026 RDLINet Respiratory Health System</p>
        <p className="text-xs max-w-md mx-auto italic">
          Disclaimer: This tool is for informational purposes and should not replace professional medical diagnosis. Always consult a doctor for health concerns.
        </p>
      </footer>
    </div>
  );
};

export default Home;
