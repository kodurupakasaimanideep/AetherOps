import { toast } from './ToastManager.js';

export class JudgeTour {
  constructor(options = {}) {
    this.currentStep = 0;
    this.steps = [
      {
        step: 1,
        title: "1. Real-Time Outage Alert",
        desc: "Active Sev-1 incident INC-9042 detected: Cosmos DB connection timeouts spiking in East US.",
        action: (app) => {
          app.selectIncidentById("INC-9042");
          app.switchTab("causal");
        }
      },
      {
        step: 2,
        title: "2. Visual Root-Cause Causal Graph",
        desc: "Graph maps live telemetry flow. Red glowing halo pinpoints the culprit microservice.",
        action: (app) => {
          app.switchTab("causal");
          const aksNode = document.querySelector('[data-node-id="aks"]');
          if (aksNode) {
            aksNode.dispatchEvent(new Event('click'));
          }
        }
      },
      {
        step: 3,
        title: "3. AI Copilot Multi-Modal RCA",
        desc: "Azure OpenAI GPT-4o correlates Kusto logs, traces, and commits to isolate non-singleton socket leak.",
        action: (app) => {
          app.aiEngine.runInteractiveScan(app.currentIncident);
        }
      },
      {
        step: 4,
        title: "4. Semantic Similarity Runbooks",
        desc: "Searched 120,000 historic Sev-1s; found 96% match (INC-8120) with proven fix.",
        action: (app) => {
          app.switchTab("similar");
        }
      },
      {
        step: 5,
        title: "5. 1-Click Azure Auto-Remediation",
        desc: "Executed automated hotfix container patch. Error rate drops from 42.8% to 1.8%.",
        action: (app) => {
          app.switchTab("causal");
          app.aiEngine.executeMitigation(app.currentIncident);
        }
      }
    ];
    this.app = options.app;
    this.isPlaying = false;
  }

  setStep(stepNumber) {
    this.currentStep = stepNumber - 1;
    const stepData = this.steps[this.currentStep];
    if (stepData) {
      stepData.action(this.app);
      this.updateUI();
      toast.show({
        title: stepData.title,
        message: stepData.desc,
        type: "azure"
      });
    }
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.setStep(this.currentStep + 2);
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.setStep(this.currentStep);
    }
  }

  autoPlay() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.setStep(1);

    const playNext = (index) => {
      if (!this.isPlaying) return;
      if (index < this.steps.length) {
        setTimeout(() => {
          if (!this.isPlaying) return;
          this.setStep(index + 1);
          playNext(index + 1);
        }, 4200);
      } else {
        this.isPlaying = false;
        toast.show({
          title: "Judge Demo Complete! 🏆",
          message: "Full incident lifecycle demonstrated in under 2 minutes.",
          type: "success",
          duration: 6000
        });
      }
    };

    playNext(1);
  }

  updateUI() {
    const pills = document.querySelectorAll('.judge-step-pill');
    pills.forEach((p, idx) => {
      if (idx === this.currentStep) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }
}
