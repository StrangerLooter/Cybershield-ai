import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import './Home.css'

export default function Home() {
  useEffect(() => {
    // Micro-interaction for hard shadows on hover
    document.querySelectorAll('.btn-hover').forEach(button => {
      button.addEventListener('mousedown', () => {
        button.style.transform = 'translate(2px, 2px)';
        button.style.boxShadow = '2px 2px 0px 0px #1A1A1A';
      });
      button.addEventListener('mouseup', () => {
        button.style.transform = 'translate(-2px, -2px)';
        button.style.boxShadow = '6px 6px 0px 0px #1A1A1A';
      });
    });
  }, [])

  return (
    <div className="home-page bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      {/* Marquee Ticker */}
      <div className="bg-charcoal text-bone h-10 flex items-center overflow-hidden z-[100] relative">
        <div className="marquee-ticker flex whitespace-nowrap gap-12 font-label-caps text-label-caps uppercase tracking-widest items-center">
          <span>ENCRYPTION: AES-256-GCM ACTIVE</span>
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span>SYSTEM STATUS: OPTIMAL</span>
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span>THREAT LEVEL: LOW</span>
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span>1930 HELPLINE INTEGRATED</span>
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span>PROTOCOL: V4.0.2 SECURE</span>
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {/* Duplicated for seamless loop */}
          <span>ENCRYPTION: AES-256-GCM ACTIVE</span>
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span>SYSTEM STATUS: OPTIMAL</span>
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span>THREAT LEVEL: LOW</span>
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span>1930 HELPLINE INTEGRATED</span>
        </div>
      </div>
      
      {/* Top Navigation */}
      <header className="fixed top-10 w-full z-50 bg-background divider h-20 flex items-center px-margin-page justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          <span className="font-headline-lg-mobile text-headline-lg-mobile tracking-tighter text-primary">CYBERSHIELD AI</span>
        </div>
        <nav className="hidden md:flex gap-8 font-label-caps text-label-caps uppercase text-charcoal">
          <Link className="text-primary font-bold" to="/">Home</Link>
          <Link className="hover:text-primary transition-colors" to="/analyzer">Scam Analyzer</Link>
          <Link className="hover:text-primary transition-colors" to="/scanner">QR Scanner</Link>
          <Link className="hover:text-primary transition-colors" to="/dashboard">Dashboard</Link>
          <Link className="hover:text-primary transition-colors" to="/academy">Cyber Academy</Link>
        </nav>
        <Link className="bg-primary text-bone px-6 py-3 border-charcoal hard-shadow btn-hover font-button-text uppercase flex items-center gap-2" to="/analyzer">
          <span className="material-symbols-outlined text-sm">bolt</span>
          ANALYZE NOW
        </Link>
      </header>
      
      <main className="mt-32">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 px-margin-page gap-gutter items-center min-h-[819px] divider pb-16">
          <div className="md:col-span-7 flex flex-col items-start gap-stack-md">
            <div className="bg-charcoal text-bone px-4 py-1 font-label-caps text-xs uppercase inline-block border-charcoal">
              ESTABLISHED 2024 / SECURE LAYER
            </div>
            <h1 className="font-headline-xl text-headline-xl text-charcoal max-w-2xl">
              Your Personal <br />
              <span className="text-primary italic underline decoration-2 underline-offset-8">Cyber Safety</span> <br />
              Assistant
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Every day, thousands of people receive suspicious messages. CyberShield AI detects scams, explains the risk, and helps you report cybercrime — in seconds.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link className="bg-primary text-bone px-8 py-4 border-charcoal hard-shadow btn-hover font-button-text uppercase flex items-center gap-2 text-lg" to="/analyzer">
                <span className="material-symbols-outlined">bolt</span>
                ANALYZE A MESSAGE
              </Link>
              <button className="bg-bone text-charcoal px-8 py-4 border-charcoal hard-shadow btn-hover font-button-text uppercase flex items-center gap-2 text-lg">
                LEARN MORE <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-8 mt-8">
              <div className="flex items-center gap-2 font-label-caps text-xs uppercase text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                Trusted by Cyber Cells
              </div>
              <div className="flex items-center gap-2 font-label-caps text-xs uppercase text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">radar</span>
                40+ Fraud Indicators
              </div>
              <div className="flex items-center gap-2 font-label-caps text-xs uppercase text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">call</span>
                1930 Integration
              </div>
            </div>
          </div>
          <div className="md:col-span-5 relative flex justify-center py-12 md:py-0">
            <div className="w-full aspect-square max-w-md relative">
              <div className="absolute inset-0 border-charcoal bg-surface-container rotate-3"></div>
              <div className="absolute inset-0 border-charcoal bg-white -rotate-2"></div>
              <div className="absolute inset-0 border-charcoal bg-charcoal flex items-center justify-center overflow-hidden">
                <img className="object-cover w-full h-full opacity-90" data-alt="A highly detailed 3D render of a futuristic cyber-sentinel droid standing in a minimalist white-lit studio. The droid is matte black with subtle glowing orange conduits, embodying the 'Sentinelle Noir' aesthetic. The atmosphere is technical, high-contrast, and editorial, with sharp shadows and architectural framing." src="https://lh3.googleusercontent.com/aida-public/AB6AXuByk5gw5q2xX13oss9yBwPTqHZYj1hGSiJraO8_87EeiTKUzw-BuRJxMYFHOmvv-VlnqVu4axwNkzICit9qszvzkzk6yyYEm_shyDBrAU5C9VnpWlgc3ssDfzuI4UuHXqcUvNHOzIv0h7cRExlqusIHP_PpDk4xW-ZvcbOF4NYundajbfRaSKgBSawswfmCfgo1Tk0iC7g55ACqCXq09A2j3H6fSJDAWvykLDFXfzm23PhsHA4HhV4z61NEKjgMPU3iKOAj-TYsp2g" alt="Cyber-sentinel droid" />
                <div className="absolute bottom-4 left-4 right-4 bg-primary text-bone p-4 border-charcoal hard-shadow">
                  <div className="font-label-caps text-xs uppercase">Model: SENTINEL-XOR-V7</div>
                  <div className="font-bold text-sm">ACTIVE SURVEILLANCE ENABLED</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 divider">
          <div className="p-margin-page border-r border-charcoal group hover:bg-primary transition-colors">
            <div className="font-headline-lg text-headline-lg group-hover:text-bone">11.28L</div>
            <div className="font-label-caps text-xs uppercase opacity-70 group-hover:text-bone">Complaints Logged</div>
          </div>
          <div className="p-margin-page border-r border-charcoal group hover:bg-primary transition-colors">
            <div className="font-headline-lg text-headline-lg group-hover:text-bone">₹7,488Cr</div>
            <div className="font-label-caps text-xs uppercase opacity-70 group-hover:text-bone">Total Loss (2024)</div>
          </div>
          <div className="p-margin-page border-r border-charcoal group hover:bg-primary transition-colors">
            <div className="font-headline-lg text-headline-lg group-hover:text-bone">47%</div>
            <div className="font-label-caps text-xs uppercase opacity-70 group-hover:text-bone">Financial Frauds</div>
          </div>
          <div className="p-margin-page group hover:bg-primary transition-colors">
            <div className="font-headline-lg text-headline-lg group-hover:text-bone">1930</div>
            <div className="font-label-caps text-xs uppercase opacity-70 group-hover:text-bone">Helpline Integration</div>
          </div>
        </section>
        
        {/* Terminal Analysis Preview */}
        <section className="bg-charcoal text-bone py-24 px-margin-page relative overflow-hidden">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            <div className="lg:col-span-4">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-6">AI Terminal Sandbox</h2>
              <p className="font-body-lg text-bone opacity-70 mb-8">
                Our intelligence engine processes suspicious links and SMS in a secure virtual environment to identify malicious patterns before you click.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary"></span>
                  <span className="font-label-caps text-xs uppercase">Llama-3 Architecture</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary"></span>
                  <span className="font-label-caps text-xs uppercase">Real-time URL detonation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary"></span>
                  <span className="font-label-caps text-xs uppercase">Fraud pattern clustering</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="border-charcoal border-4 bg-white hard-shadow-lg p-1 overflow-hidden">
                <div className="bg-charcoal p-4 flex justify-between items-center text-bone font-label-caps text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="ml-4 uppercase tracking-widest">CYBERSHIELD_AI_TERMINAL v2.4.1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></span>
                    STATUS: ONLINE
                  </div>
                </div>
                <div className="bg-bone text-charcoal p-8 font-mono text-sm min-h-[400px]">
                  <div className="mb-6">
                    <span className="text-primary font-bold">user@input:</span> "Dear SBI Customer, your KYC has expired. Please update immediately at https://sbi-verify-kyc.org to avoid account suspension."
                  </div>
                  <div className="space-y-1 text-on-surface-variant">
                    <div>[SYS] Initializing Llama-3 Analysis Engine... <span className="text-green-600">DONE</span></div>
                    <div>[URL] Resolving https://sbi-verify-kyc.org...</div>
                    <div>[URL] IP Origin detected: [REDACTED], Romania.</div>
                    <div>[SMS] Checking linguistic patterns against known phishing templates...</div>
                    <div>[SMS] Urgency weight: 9.4/10</div>
                    <div>[DB] Domain registration: 2 hours ago. <span className="text-primary">WARNING</span></div>
                    <div className="pt-4 border-t border-charcoal mt-4">
                      <div className="bg-primary text-bone p-6 border-charcoal hard-shadow inline-block">
                        <div className="text-3xl font-black mb-1">96% CRITICAL RISK</div>
                        <div className="font-bold uppercase tracking-tighter">PHISHING ATTEMPT DETECTED</div>
                        <div className="text-[10px] mt-2 opacity-80">Report ID: CS-9882-KYC | Severity: Critical</div>
                      </div>
                      <div className="mt-4 flex gap-4">
                        <button className="bg-charcoal text-bone px-6 py-2 uppercase font-bold text-xs">REPORT TO CYBER CELL</button>
                        <button className="border-2 border-charcoal px-6 py-2 uppercase font-bold text-xs">DO NOT CLICK</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature Matrix */}
        <section className="py-24 px-margin-page bg-bone">
          <div className="mb-16">
            <div className="font-label-caps text-xs text-primary font-bold uppercase mb-2">01 / THE CORE ENGINE</div>
            <h2 className="font-headline-lg text-headline-lg text-charcoal">Competitive Analysis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-charcoal border-2 text-left bg-white">
              <thead className="bg-charcoal text-bone">
                <tr>
                  <th className="p-6 font-label-caps text-sm uppercase">Threat Intelligence</th>
                  <th className="p-6 font-label-caps text-sm uppercase bg-primary">CyberShield AI</th>
                  <th className="p-6 font-label-caps text-sm uppercase">Legacy AV</th>
                  <th className="p-6 font-label-caps text-sm uppercase">Spam Filters</th>
                </tr>
              </thead>
              <tbody className="text-charcoal font-body-md">
                <tr className="divider">
                  <td className="p-6 font-bold">Real-Time Threat Analysis</td>
                  <td className="p-6 bg-primary-container text-on-primary-container font-black">AI-Powered (Llama-3)</td>
                  <td className="p-6">Signature Based</td>
                  <td className="p-6">Heuristic Only</td>
                </tr>
                <tr className="divider">
                  <td className="p-6 font-bold">Automated Police-Ready PDF</td>
                  <td className="p-6 bg-primary-container text-on-primary-container font-black">Instant Generation</td>
                  <td className="p-6 text-on-surface-variant">—</td>
                  <td className="p-6 text-on-surface-variant">—</td>
                </tr>
                <tr className="divider">
                  <td className="p-6 font-bold">QR Code &amp; Link Sandboxing</td>
                  <td className="p-6 bg-primary-container text-on-primary-container font-black">Full Virtual Detonation</td>
                  <td className="p-6 text-on-surface-variant">URL Check Only</td>
                  <td className="p-6 text-on-surface-variant">Blacklist Match</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold">Emergency 1930 Connect</td>
                  <td className="p-6 bg-primary-container text-on-primary-container font-black">Direct API Sync</td>
                  <td className="p-6 text-on-surface-variant">—</td>
                  <td className="p-6 text-on-surface-variant">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        {/* System Architecture */}
        <section className="py-24 px-margin-page divider">
          <div className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
              <div className="font-label-caps text-xs text-primary font-bold uppercase mb-2">02 / SYSTEM ARCHITECTURE</div>
              <h2 className="font-headline-lg text-headline-lg text-charcoal max-w-xl">From Suspicion to Action in <span className="italic text-primary">300ms</span></h2>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-charcoal">v4.0.2</div>
              <div className="font-label-caps text-xs uppercase opacity-60">Stable Kernel</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-charcoal border-2 bg-white">
            <div className="p-12 border-b md:border-b-0 md:border-r border-charcoal hover:bg-surface-container transition-colors relative group">
              <div className="text-primary font-black text-6xl mb-8 opacity-20 group-hover:opacity-100 transition-opacity">01</div>
              <div className="bg-charcoal text-bone px-3 py-1 font-label-caps text-[10px] uppercase inline-block mb-4">Ingestion</div>
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal mb-4">Intake Hub</h3>
              <p className="text-on-surface-variant">Upload screenshots, forward SMS, or scan QR codes. Multi-modal inputs are normalized for scanning.</p>
            </div>
            <div className="p-12 border-b md:border-b-0 md:border-r border-charcoal hover:bg-surface-container transition-colors group">
              <div className="text-primary font-black text-6xl mb-8 opacity-20 group-hover:opacity-100 transition-opacity">02</div>
              <div className="bg-charcoal text-bone px-3 py-1 font-label-caps text-[10px] uppercase inline-block mb-4">Processing</div>
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal mb-4">Intelligence Engine</h3>
              <p className="text-on-surface-variant">Llama-3 processes text intent while our Link Detonator executes URLs in a sandboxed OS.</p>
            </div>
            <div className="p-12 hover:bg-surface-container transition-colors group">
              <div className="text-primary font-black text-6xl mb-8 opacity-20 group-hover:opacity-100 transition-opacity">03</div>
              <div className="bg-charcoal text-bone px-3 py-1 font-label-caps text-[10px] uppercase inline-block mb-4">Reporting</div>
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-charcoal mb-4">Output Generation</h3>
              <p className="text-on-surface-variant">Receive a detailed risk report and an auto-filled PDF formatted for police reporting.</p>
            </div>
          </div>
        </section>
        
        {/* Roadmap (Coming Soon) */}
        <section className="py-24 px-margin-page bg-surface-container">
          <h2 className="font-headline-lg text-headline-lg text-charcoal mb-16 text-center italic">Future Roadmap <span className="material-symbols-outlined text-4xl align-middle">upcoming</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {/* Roadmap Item 1 */}
            <div className="bg-white border-charcoal border-2 p-8 hard-shadow corner-accent relative group">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">record_voice_over</span>
                <span className="bg-charcoal text-bone px-2 py-1 text-[10px] uppercase font-bold">Q1 2025</span>
              </div>
              <h4 className="font-bold text-xl text-charcoal mb-2 uppercase">Voice Assistant</h4>
              <p className="text-on-surface-variant text-sm">Real-time analysis of suspicious calls via AI voice-layer interception.</p>
            </div>
            {/* Roadmap Item 2 */}
            <div className="bg-white border-charcoal border-2 p-8 hard-shadow corner-accent relative group">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">phone_callback</span>
                <span className="bg-charcoal text-bone px-2 py-1 text-[10px] uppercase font-bold">Q2 2025</span>
              </div>
              <h4 className="font-bold text-xl text-charcoal mb-2 uppercase">AI Call Analyzer</h4>
              <p className="text-on-surface-variant text-sm">Advanced sentiment analysis to detect high-pressure scam tactics in live audio.</p>
            </div>
            {/* Roadmap Item 3 */}
            <div className="bg-white border-charcoal border-2 p-8 hard-shadow corner-accent relative group">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">extension</span>
                <span className="bg-charcoal text-bone px-2 py-1 text-[10px] uppercase font-bold">DEVELOPMENT</span>
              </div>
              <h4 className="font-bold text-xl text-charcoal mb-2 uppercase">Browser Extension</h4>
              <p className="text-on-surface-variant text-sm">Seamless desktop protection for net banking and e-commerce transactions.</p>
            </div>
            {/* Roadmap Item 4 */}
            <div className="bg-white border-charcoal border-2 p-8 hard-shadow corner-accent relative group">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">map</span>
                <span className="bg-charcoal text-bone px-2 py-1 text-[10px] uppercase font-bold">BETA</span>
              </div>
              <h4 className="font-bold text-xl text-charcoal mb-2 uppercase">Fraud Heatmap</h4>
              <p className="text-on-surface-variant text-sm">Interactive visualization of active regional scam campaigns in India.</p>
            </div>
            {/* Roadmap Item 5 */}
            <div className="bg-white border-charcoal border-2 p-8 hard-shadow corner-accent relative group">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">female</span>
                <span className="bg-primary text-bone px-2 py-1 text-[10px] uppercase font-bold">PRIORITY</span>
              </div>
              <h4 className="font-bold text-xl text-charcoal mb-2 uppercase">Women's Safety Mode</h4>
              <p className="text-on-surface-variant text-sm">Specialized detection for online harassment and deep-fake extortion attempts.</p>
            </div>
            {/* Roadmap Item 6 */}
            <div className="bg-white border-charcoal border-2 p-8 hard-shadow corner-accent relative group">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">install_mobile</span>
                <span className="bg-charcoal text-bone px-2 py-1 text-[10px] uppercase font-bold">Q4 2024</span>
              </div>
              <h4 className="font-bold text-xl text-charcoal mb-2 uppercase">Fake App Detector</h4>
              <p className="text-on-surface-variant text-sm">Analyzes APK permissions and code signatures to identify fraudulent banking apps.</p>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-24 px-margin-page bg-charcoal text-bone">
          <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-16">Intelligence Community Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="p-8 border-l-4 border-primary bg-bone/5">
              <p className="font-body-lg italic mb-6">"The speed at which CyberShield AI generates reporting documentation is a game-changer for our field agents. It bridges the gap between citizens and authorities."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary"></div>
                <div>
                  <div className="font-bold text-sm uppercase">Sub-Inspector R. Sharma</div>
                  <div className="text-[10px] opacity-60">Cyber Crime Cell, Delhi</div>
                </div>
              </div>
            </div>
            <div className="p-8 border-l-4 border-primary bg-bone/5">
              <p className="font-body-lg italic mb-6">"I was about to pay a 'pending electricity bill' through a link. CyberShield identified it as a credential harvester in 2 seconds. Saved me lakhs."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary"></div>
                <div>
                  <div className="font-bold text-sm uppercase">Priya Mehta</div>
                  <div className="text-[10px] opacity-60">Business Owner</div>
                </div>
              </div>
            </div>
            <div className="p-8 border-l-4 border-primary bg-bone/5">
              <p className="font-body-lg italic mb-6">"As a researcher, I find their Llama-3 implementation for contextual fraud detection to be one of the most practical uses of LLMs in cybersecurity today."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary"></div>
                <div>
                  <div className="font-bold text-sm uppercase">Dr. A. Kumar</div>
                  <div className="text-[10px] opacity-60">AI Ethics &amp; Security Lead</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="py-stack-lg px-margin-page text-center divider bg-primary text-bone">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline-xl text-headline-xl mb-8">Received a Suspicious Message?</h2>
            <p className="font-body-lg mb-12 text-bone/80">Don't second-guess your safety. Let our AI handle the analysis and provide you with a clear, actionable report instantly.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link className="bg-charcoal text-bone px-10 py-5 border-2 border-bone hard-shadow btn-hover font-button-text uppercase text-xl flex items-center justify-center gap-3" to="/analyzer">
                <span className="material-symbols-outlined">bolt</span>
                ANALYZE A MESSAGE
              </Link>
              <a className="bg-bone text-charcoal px-10 py-5 border-2 border-charcoal hard-shadow btn-hover font-button-text uppercase text-xl flex items-center justify-center gap-3" href="tel:1930">
                <span className="material-symbols-outlined">call</span>
                CALL 1930 HELPLINE
              </a>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-charcoal text-bone py-16 px-margin-page">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">shield</span>
              <span className="font-headline-lg-mobile text-headline-lg-mobile tracking-tighter text-primary">CYBERSHIELD AI</span>
            </div>
            <p className="max-w-sm opacity-60">Building the next generation of sovereign digital defense for 1.4 billion citizens. Powered by advanced AI and human vigilance.</p>
          </div>
          <div>
            <h5 className="font-label-caps text-sm uppercase mb-6 text-primary">Product</h5>
            <ul className="space-y-4 opacity-70 font-label-caps text-xs">
              <li><Link className="hover:text-primary transition-colors" to="/analyzer">Scam Analyzer</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/scanner">QR Scanner</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/academy">Cyber Academy</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/docs">API Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-sm uppercase mb-6 text-primary">Resources</h5>
            <ul className="space-y-4 opacity-70 font-label-caps text-xs">
              <li><Link className="hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/terms">Terms of Service</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/audit">Security Audit</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/support">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-bone/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-label-caps text-xs opacity-50">© 2024 CYBERSHIELD AI. SECURE_PROTOCOL_V2.0</div>
          <div className="flex gap-6 opacity-50 font-label-caps text-xs uppercase">
            <span>Latency: 312ms</span>
            <span>Region: AS-SOUTH-1</span>
            <span>Tier: Sentinel Elite</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
