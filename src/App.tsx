/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import StartMethod from './components/StartMethod';
import HowItWorks from './components/HowItWorks';
import Cases from './components/Cases';
import Differential from './components/Differential';
import EducationalPlatform from './components/EducationalPlatform';
import TargetAudience from './components/TargetAudience';
import Footer from './components/Footer';
import { FormProvider } from './FormContext';

export default function App() {
  return (
    <FormProvider>
      <div className="relative min-h-screen font-sans selection:bg-brand-orange/30 selection:text-brand-orange">
        <Background />
        <Navbar />
        
        <main>
          <Hero />
          <Problem />
          <StartMethod />
          <HowItWorks />
          <Cases />
          <Differential />
          <EducationalPlatform />
          <TargetAudience />
        </main>

        <Footer />
      </div>
    </FormProvider>
  );
}
