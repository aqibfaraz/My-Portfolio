import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import './App.css';

const FIRST_TERMINAL_INFO_LINES = [
  '[ OK ] Initializing system kernel...',
  '[ OK ] Loading modules...',
  '[ OK ] Connecting to secure server...',
  '[ OK ] System ready.',
  '',
  '----------------------------------------',
  "Hi, I'm Aqib Faraz",
  'Web & App Developer',
  '',
  'I build modern websites, mobile apps,',
  'and scalable web applications.',
  '',
  "Type 'help' to begin"
];

const HOME_LINES = [
  'HOME',
  "Hello, I'm Aqib Faraz",
  'Title: Developer',
  'I create beautiful and functional websites with modern technologies.',
  'Passionate about building amazing user experiences.',
  'Status: Freelance Work Available'
];

const ABOUT_LINES = [
  'ABOUT ME',
  "Hi! I'm a passionate developer with expertise in building modern web applications.",
  'I love creating user-friendly interfaces and solving complex problems with clean code.',
  'I build responsive and performant apps across frontend and backend stacks.',
  '- Clean Code',
  '- Responsive Design',
  '- Fast Performance'
];

const SKILLS_LINES = [
  'MY SKILLS',
  '- React: 80%',
  '- Java: 80%',
  '- Node.js: 50%',
  '- HTML5: 95%',
  '- CSS3: 90%',
  '- JavaScript: 85%',
  '- Git: 85%',
  '- Database: 75%'
];

const PROJECTS_LINES = [
  'MY PROJECTS',
  '1) Registration Form App',
  '2) Voting System Web Dev Project',
  '3) Language Identifier NLP Project',
  '4) USA Data Manipulation Project',
  '5) Secure Noted Pad',
  '6) Flutter Backend',
  'Type: project 1 (or 2..6)'
];

const CONTACT_LINES = [
  'CONTACT',
  'Email: Aqibfahraz@gmail.com',
  'Phone: +923033961515',
  'Location: Karachi, Pakistan',
  'GitHub: https://github.com/aqibfaraz',
  'LinkedIn: https://www.linkedin.com/in/aqib-faraz-99848638b/'
];

const PROJECT_DETAILS = {
  1: [
    'PROJECT 1: Registration Form App',
    'Tech: JavaScript, HTML, CSS',
    'Code/Demo: https://github.com/aqibfaraz/registration-form-app'
  ],
  2: [
    'PROJECT 2: Voting System Web Dev Project',
    'Tech: JavaScript, Node.js, Database',
    'Code/Demo: https://github.com/aqibfaraz/Voting-System-Web-Dev-Project'
  ],
  3: [
    'PROJECT 3: Language Identifier NLP Project',
    'Tech: Python, NLP, Machine Learning',
    'Code/Demo: https://github.com/aqibfaraz/Language-Identifier-NLP-Project'
  ],
  4: [
    'PROJECT 4: USA Data Manipulation Project',
    'Tech: Python, Pandas, Data Analysis',
    'Code/Demo: https://github.com/aqibfaraz/USA-Data-Manipulation-Project'
  ],
  5: [
    'PROJECT 5: Secure Noted Pad',
    'Tech: Python, Encryption, Security',
    'Code/Demo: https://github.com/aqibfaraz/Secure-Noted-Pad-Infomation-Security-Project'
  ],
  6: [
    'PROJECT 6: Flutter Backend',
    'Tech: JavaScript, Node.js, API',
    'Code/Demo: https://github.com/aqibfaraz/Flutter-backend'
  ]
};

const SKILL_DETAILS = {
  react: ['SKILL: React', 'Proficiency: 80%', 'Building reusable components and modern UIs.'],
  java: ['SKILL: Java', 'Proficiency: 80%', 'Core Java and object-oriented development.'],
  'node.js': ['SKILL: Node.js', 'Proficiency: 50%', 'REST APIs and backend services.'],
  html5: ['SKILL: HTML5', 'Proficiency: 95%', 'Semantic markup and accessible structure.'],
  css3: ['SKILL: CSS3', 'Proficiency: 90%', 'Responsive layouts and polished styling.'],
  javascript: ['SKILL: JavaScript', 'Proficiency: 85%', 'Dynamic client-side and server-side scripting.'],
  git: ['SKILL: Git', 'Proficiency: 85%', 'Version control and collaboration workflows.'],
  database: ['SKILL: Database', 'Proficiency: 75%', 'Data modeling and query design.']
};

const HELP_LINES = [
  'AVAILABLE COMMANDS',
  '- help',
  '- home',
  '- about      (opens new terminal panel)',
  '- projects   (opens new terminal panel)',
  '- skills     (opens new terminal panel)',
  '- contact    (opens new terminal panel)',
  '- project 1  (opens nested terminal in current panel)',
  '- skill react (opens nested terminal in current panel)',
  '- qr         (show QR info)',
  '- clear'
];

const createTerminalState = (id, title) => ({
  id,
  title,
  lines: [],
  input: '',
  history: [],
  historyIndex: -1,
  isBusy: false
});

const TerminalPanel = ({
  terminal,
  isMainTerminal,
  showEmbeddedQr,
  qrCanvasRef,
  canClose,
  onClose,
  onInputChange,
  onSubmit,
  onInputKeyDown,
  registerInputRef,
  onActivate
}) => {
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminal.lines]);

  return (
    <div className={`terminal-window ${showEmbeddedQr ? 'has-main-qr' : ''}`} onMouseDown={onActivate}>
      <div className="terminal-header">
        <div className="window-controls">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <p className="terminal-title">{terminal.title}</p>
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          disabled={!canClose}
          aria-label={`Close ${terminal.title}`}
        >
          ×
        </button>
      </div>

      <div className="terminal-output" ref={outputRef}>
        {terminal.lines.map((line) => (
          <p key={line.id} className={`line ${line.type}`}>
            {line.text}
          </p>
        ))}
      </div>

      {isMainTerminal && (
        <aside className={`main-terminal-qr ${showEmbeddedQr ? 'is-visible' : 'is-hidden'}`} aria-hidden={!showEmbeddedQr}>
          <p className="main-terminal-qr-label">Scan for Contact</p>
          <div className="main-terminal-qr-frame">
            <canvas ref={qrCanvasRef} className="main-terminal-qr-canvas" />
          </div>
        </aside>
      )}

      <form className="terminal-input-row" onSubmit={onSubmit}>
        <span className="prompt">PS C:\\Portfolio&gt;</span>
        <input
          ref={(element) => registerInputRef(terminal.id, element)}
          className="terminal-input"
          value={terminal.input}
          onChange={(event) => onInputChange(terminal.id, event.target.value)}
          onKeyDown={(event) => onInputKeyDown(event, terminal.id)}
          autoComplete="off"
          spellCheck="false"
          placeholder={terminal.isBusy ? 'processing...' : 'type a command'}
          aria-label={`Command input for ${terminal.title}`}
          disabled={terminal.isBusy}
        />
        <span className="cursor" aria-hidden="true">
          █
        </span>
      </form>
    </div>
  );
};

function App() {
  const terminalCounter = useRef(2);
  const nodeCounter = useRef(2);
  const lineCounter = useRef(1);
  const orientationToggle = useRef(false);
  const inputRefs = useRef({});
  const hasBooted = useRef(false);
  const qrCanvasRef = useRef(null);

  const [terminals, setTerminals] = useState(() => ({
    'terminal-1': createTerminalState('terminal-1', 'terminal-1')
  }));
  const [layout, setLayout] = useState({
    id: 'node-1',
    type: 'leaf',
    terminalId: 'terminal-1'
  });
  const [activeTerminalId, setActiveTerminalId] = useState('terminal-1');

  const terminalCount = useMemo(() => Object.keys(terminals).length, [terminals]);

  const nextTerminalId = () => `terminal-${terminalCounter.current++}`;
  const nextNodeId = () => `node-${nodeCounter.current++}`;
  const nextLineId = () => `line-${lineCounter.current++}`;
  const nextOrientation = () => {
    orientationToggle.current = !orientationToggle.current;
    return orientationToggle.current ? 'horizontal' : 'vertical';
  };

  const registerInputRef = useCallback((terminalId, element) => {
    if (!element) {
      delete inputRefs.current[terminalId];
      return;
    }
    inputRefs.current[terminalId] = element;
  }, []);

  const updateTerminal = useCallback((terminalId, updater) => {
    setTerminals((prev) => {
      const targetTerminal = prev[terminalId];
      if (!targetTerminal) {
        return prev;
      }
      const updatedTerminal = updater(targetTerminal);
      if (updatedTerminal === targetTerminal) {
        return prev;
      }
      return {
        ...prev,
        [terminalId]: updatedTerminal
      };
    });
  }, []);

  const appendLine = useCallback(
    (terminalId, text, type = 'output') => {
      const lineId = nextLineId();
      updateTerminal(terminalId, (terminal) => ({
        ...terminal,
        lines: [...terminal.lines, { id: lineId, type, text }]
      }));
    },
    [updateTerminal]
  );

  const typeLine = useCallback((terminalId, text, type = 'output', speed = 16) => {
    return new Promise((resolve) => {
      const lineId = nextLineId();
      let index = 0;

      updateTerminal(terminalId, (terminal) => ({
        ...terminal,
        lines: [...terminal.lines, { id: lineId, type, text: '' }]
      }));

      if (!text.length) {
        resolve();
        return;
      }

      const timer = setInterval(() => {
        index += 1;
        setTerminals((prev) => {
          const terminal = prev[terminalId];
          if (!terminal) {
            return prev;
          }

          return {
            ...prev,
            [terminalId]: {
              ...terminal,
              lines: terminal.lines.map((line) =>
                line.id === lineId
                  ? {
                      ...line,
                      text: text.slice(0, index)
                    }
                  : line
              )
            }
          };
        });

        if (index >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }, [updateTerminal]);

  const splitLeafByTerminalId = useCallback(
    (node, targetTerminalId, newLeaf, orientation) => {
      if (node.type === 'leaf') {
        if (node.terminalId !== targetTerminalId) {
          return node;
        }

        return {
          id: nextNodeId(),
          type: 'split',
          orientation,
          children: [node, newLeaf]
        };
      }

      return {
        ...node,
        children: node.children.map((child) =>
          splitLeafByTerminalId(child, targetTerminalId, newLeaf, orientation)
        )
      };
    },
    []
  );

  const removeLeafByTerminalId = useCallback((node, targetTerminalId) => {
    if (node.type === 'leaf') {
      return node.terminalId === targetTerminalId ? null : node;
    }

    const nextChildren = node.children
      .map((child) => removeLeafByTerminalId(child, targetTerminalId))
      .filter(Boolean);

    if (!nextChildren.length) {
      return null;
    }

    if (nextChildren.length === 1) {
      return nextChildren[0];
    }

    return {
      ...node,
      children: nextChildren
    };
  }, []);

  const openTerminalWithContent = useCallback(
    async ({ title, lines, mode, currentTerminalId }) => {
      const newTerminalId = nextTerminalId();
      const newLeaf = {
        id: nextNodeId(),
        type: 'leaf',
        terminalId: newTerminalId
      };

      setTerminals((prev) => ({
        ...prev,
        [newTerminalId]: {
          ...createTerminalState(newTerminalId, title),
          isBusy: true
        }
      }));

      if (mode === 'root') {
        setLayout((prev) => {
          if (prev.type === 'split') {
            return {
              ...prev,
              children: [...prev.children, newLeaf]
            };
          }

          return {
            id: nextNodeId(),
            type: 'split',
            orientation: nextOrientation(),
            children: [prev, newLeaf]
          };
        });
      } else {
        setLayout((prev) =>
          splitLeafByTerminalId(prev, currentTerminalId, newLeaf, nextOrientation())
        );
      }

      setActiveTerminalId(newTerminalId);

      for (const line of lines) {
        await typeLine(newTerminalId, line, 'output', 12);
      }

      updateTerminal(newTerminalId, (terminal) => ({
        ...terminal,
        isBusy: false
      }));
    },
    [splitLeafByTerminalId, typeLine, updateTerminal]
  );

  const runCommand = useCallback(
    async (terminalId, rawCommand) => {
      const command = rawCommand.trim();
      if (!command) {
        return;
      }

      const normalized = command.toLowerCase();
      appendLine(terminalId, `PS C:\\Portfolio> ${command}`, 'command');

      if (normalized === 'clear') {
        updateTerminal(terminalId, (terminal) => ({
          ...terminal,
          lines: []
        }));
        return;
      }

      if (normalized === 'help') {
        updateTerminal(terminalId, (terminal) => ({ ...terminal, isBusy: true }));
        for (const line of HELP_LINES) {
          await typeLine(terminalId, line, 'output', 12);
        }
        updateTerminal(terminalId, (terminal) => ({ ...terminal, isBusy: false }));
        return;
      }

      if (normalized === 'home') {
        updateTerminal(terminalId, (terminal) => ({ ...terminal, isBusy: true }));
        for (const line of HOME_LINES) {
          await typeLine(terminalId, line, 'output', 12);
        }
        updateTerminal(terminalId, (terminal) => ({ ...terminal, isBusy: false }));
        return;
      }

      if (normalized === 'qr') {
        if (terminalId === 'terminal-1') {
          appendLine(terminalId, 'Scan the QR code on the right to open contact page', 'system');
        } else {
          appendLine(terminalId, 'QR command is available in main terminal only.', 'system');
        }
        return;
      }

      if (['about', 'projects', 'skills', 'contact'].includes(normalized)) {
        const sourceMap = {
          about: ABOUT_LINES,
          projects: PROJECTS_LINES,
          skills: SKILLS_LINES,
          contact: CONTACT_LINES
        };

        await openTerminalWithContent({
          title: normalized,
          lines: sourceMap[normalized],
          mode: 'root',
          currentTerminalId: terminalId
        });
        appendLine(terminalId, `Opened ${normalized} in a new terminal panel.`, 'system');
        return;
      }

      const projectMatch = normalized.match(/^project\s+(\d+)$/);
      if (projectMatch) {
        const projectNumber = Number(projectMatch[1]);
        const detailLines = PROJECT_DETAILS[projectNumber];

        if (!detailLines) {
          appendLine(terminalId, `Project ${projectNumber} not found.`, 'error');
          return;
        }

        await openTerminalWithContent({
          title: `project-${projectNumber}`,
          lines: detailLines,
          mode: 'nested',
          currentTerminalId: terminalId
        });
        appendLine(terminalId, `Opened project ${projectNumber} in nested terminal.`, 'system');
        return;
      }

      const skillMatch = normalized.match(/^skill\s+(.+)$/);
      if (skillMatch) {
        const skillKey = skillMatch[1].trim();
        const detailLines = SKILL_DETAILS[skillKey];

        if (!detailLines) {
          appendLine(terminalId, `Skill '${skillKey}' not found.`, 'error');
          appendLine(terminalId, 'Try: skill react | skill javascript | skill css3', 'system');
          return;
        }

        await openTerminalWithContent({
          title: `skill-${skillKey}`,
          lines: detailLines,
          mode: 'nested',
          currentTerminalId: terminalId
        });
        appendLine(terminalId, `Opened skill ${skillKey} in nested terminal.`, 'system');
        return;
      }

      appendLine(terminalId, `Command not found: ${command}`, 'error');
      appendLine(terminalId, 'Type help to view available commands.', 'system');
    },
    [appendLine, openTerminalWithContent, typeLine, updateTerminal]
  );

  const handleSubmit = useCallback(
    async (event, terminalId) => {
      event.preventDefault();

      const terminal = terminals[terminalId];
      if (!terminal || terminal.isBusy) {
        return;
      }

      const submitted = terminal.input.trim();
      if (!submitted) {
        return;
      }

      updateTerminal(terminalId, (current) => ({
        ...current,
        input: '',
        history: [...current.history, submitted],
        historyIndex: -1
      }));

      await runCommand(terminalId, submitted);
      setActiveTerminalId(terminalId);
    },
    [runCommand, terminals, updateTerminal]
  );

  const handleInputKeyDown = useCallback(
    (event, terminalId) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
        return;
      }

      const terminal = terminals[terminalId];
      if (!terminal || !terminal.history.length) {
        return;
      }

      event.preventDefault();

      if (event.key === 'ArrowUp') {
        const nextIndex =
          terminal.historyIndex === -1
            ? terminal.history.length - 1
            : Math.max(terminal.historyIndex - 1, 0);

        updateTerminal(terminalId, (current) => ({
          ...current,
          historyIndex: nextIndex,
          input: current.history[nextIndex]
        }));
        return;
      }

      const nextIndex = terminal.historyIndex + 1;
      if (nextIndex >= terminal.history.length) {
        updateTerminal(terminalId, (current) => ({
          ...current,
          historyIndex: -1,
          input: ''
        }));
        return;
      }

      updateTerminal(terminalId, (current) => ({
        ...current,
        historyIndex: nextIndex,
        input: current.history[nextIndex]
      }));
    },
    [terminals, updateTerminal]
  );

  const handleCloseTerminal = useCallback(
    (terminalId) => {
      if (terminalCount <= 1) {
        return;
      }

      setLayout((prev) => removeLeafByTerminalId(prev, terminalId));
      setTerminals((prev) => {
        const next = { ...prev };
        delete next[terminalId];
        return next;
      });

      const fallbackId = Object.keys(terminals).find((id) => id !== terminalId);
      if (fallbackId) {
        setActiveTerminalId(fallbackId);
      }
    },
    [removeLeafByTerminalId, terminalCount, terminals]
  );

  useEffect(() => {
    if (hasBooted.current) {
      return;
    }
    hasBooted.current = true;

    const boot = async () => {
      updateTerminal('terminal-1', (terminal) => ({ ...terminal, isBusy: true }));

      for (const line of FIRST_TERMINAL_INFO_LINES) {
        const lineType = line.startsWith('[ OK ]') ? 'system' : 'output';
        await typeLine('terminal-1', line, lineType, 18);
      }

      updateTerminal('terminal-1', (terminal) => ({ ...terminal, isBusy: false }));
      setActiveTerminalId('terminal-1');

      if (window.location.hash.toLowerCase() === '#contact') {
        await openTerminalWithContent({
          title: 'contact',
          lines: CONTACT_LINES,
          mode: 'root',
          currentTerminalId: 'terminal-1'
        });
      }
    };

    boot();
  }, [openTerminalWithContent, typeLine, updateTerminal]);

  useEffect(() => {
    const input = inputRefs.current[activeTerminalId];
    if (input && !terminals[activeTerminalId]?.isBusy) {
      input.focus();
    }
  }, [activeTerminalId, terminals]);

  useEffect(() => {
    if (!qrCanvasRef.current) {
      return;
    }

    QRCode.toCanvas(qrCanvasRef.current, 'https://aqibfaraz.dev/#contact', {
      width: 136,
      margin: 1,
      color: {
        dark: '#39ff14',
        light: '#0b1f3a'
      }
    });
  }, []);

  const renderNode = useCallback(
    (node) => {
      if (node.type === 'leaf') {
        const terminal = terminals[node.terminalId];
        if (!terminal) {
          return null;
        }

        return (
          <div className="layout-node" key={node.id}>
            <TerminalPanel
              terminal={terminal}
              isMainTerminal={terminal.id === 'terminal-1'}
              showEmbeddedQr={terminal.id === 'terminal-1' && terminalCount === 1}
              qrCanvasRef={qrCanvasRef}
              canClose={terminalCount > 1}
              onClose={() => handleCloseTerminal(terminal.id)}
              onInputChange={(terminalId, value) =>
                updateTerminal(terminalId, (current) => ({ ...current, input: value }))
              }
              onSubmit={(event) => handleSubmit(event, terminal.id)}
              onInputKeyDown={handleInputKeyDown}
              registerInputRef={registerInputRef}
              onActivate={() => setActiveTerminalId(terminal.id)}
            />
          </div>
        );
      }

      return (
        <div className={`layout-node layout-split ${node.orientation}`} key={node.id}>
          {node.children.map((child) => renderNode(child))}
        </div>
      );
    },
    [
      handleCloseTerminal,
      handleInputKeyDown,
      handleSubmit,
      registerInputRef,
      terminalCount,
      terminals,
      updateTerminal
    ]
  );

  return (
    <div className="terminal-page">
      <div className="terminal-grid" role="application" aria-label="Multi-terminal developer environment">
        {renderNode(layout)}
      </div>
    </div>
  );
}

export default App;
