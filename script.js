const cvData = {
    name: "Bryan Tabares",
    email: "tabaresbryan39@gmail.com", 
    phone: "+63 935-655-8151",
    location: "Taguig, Metro Manila, PH",
    github: "https://github.com/btabares20",
    linkedin: "https://linkedin.com/in/bk-tabares",
    summary: "Backend-focused software developer with almost 3 years of experience building scalable data pipelines and automation systems. I specialize in Python, database design, and cloud technologies, with a track record of improving system reliability and solving complex technical challenges.",
    skills: {
        "Programming Languages": ["Python", "PHP", "JavaScript", "HTML", "CSS"],
        "Technologies": ["Docker", "Kestra", "Git/GitHub", "Supabase", "Digital Ocean", "FastAPI", "PostgreSQL", "Redis"],
        "Operating Systems": ["Windows", "Linux (Ubuntu, RHEL)"],
        "Cloud Platforms": ["AWS Lambda", "Digital Ocean", "Supabase"]
    },
    experience: [
        {
            company: "CGI Philippines",
            position: "Mid-Level Python Developer",
            duration: "September 2025 - Current",
            location: "Taguig City, Metro Manila",
            techStack: ["Python", "Docker", "Shell"],
            responsibilities: [
                "Contributing to migration of GVCE VM-based jobs and scripts to AWS EKS using Python, Docker, and Shell",
                "Refactoring and testing legacy scripts from multiple languages to run on Python3 and modernized pipelines",
                "Developing helper tools to streamline team workflows and improve overall efficiency",
                "Supporting migration efforts for a major financial client, handling hundreds of jobs"
            ]
        },
        {
            company: "KodeAcross",
            position: "Mid-Level Software Developer",
            duration: "August 2024 - August 2025",
            location: "Remote",
            techStack: ["Python", "Supabase (Postgres)", "Redis", "Cursor"],
            responsibilities: [
                "Scaled backend and data pipelines for insurance verification platform",
                "Automated workflows with Kestra and Hatchet",
                "Improved data quality with partners (e.g., CloudCruise)",
                "Redesigned normalized schemas in Supabase (Postgres)",
                "Built internal APIs using FastAPI",
                "Developed webhooks for 3rd party integrations"
            ]
        },
        {
            company: "Philippine Dealing System Holdings Corp. & Subsidiaries",
            position: "Software Developer", 
            duration: "September 2022 - May 2024",
            location: "Makati City",
            techStack: ["Python", "AWS (Lambda)", "Ubuntu", "RHEL"],
            responsibilities: [
                "Enhanced and maintained legacy Python apps on on-prem (Ubuntu/RHEL) and AWS",
                "Supported daily operations by fixing critical bugs and improving app reliability",
                "Built and maintained AWS Lambda-based services on an existing client-facing application"
            ]
        },
        {
            company: "City College of Calamba",
            position: "Web Developer - Intern",
            duration: "April 2022 - July 2022", 
            location: "Calamba City",
            techStack: ["PHP", "JavaScript"],
            responsibilities: [
                "Developed a Student Evaluation and Curriculum Maker module for the school's LMS",
                "Handled front-end, back-end, and database design for both modules"
            ]
        }
    ],
    education: [
        {
            institution: "City College of Calamba",
            degree: "Bachelor of Science in Information Technology",
            duration: "2018-2022",
            location: "Calamba, Laguna"
        }, { institution: "Asian Institute of Computer Studies", 
            degree: "Information and Communication Technologies",
            duration: "2016-2018",
            location: "Calamba, Laguna"
        }
    ]
};

const commands = {
    'help': {
        desc: 'Show all available commands',
        action: showHelp
    },
    'whoami': {
        desc: 'Display basic information about me',
        action: showWhoami
    },
    'about': {
        desc: 'Show detailed summary',
        action: showAbout
    },
    'skills': {
        desc: 'List technical skills and competencies',
        action: showSkills
    },
    'experience': {
        desc: 'Show work experience history',
        action: showExperience
    },
    'education': {
        desc: 'Display education background',
        action: showEducation
    },
    'contact': {
        desc: 'Get contact information',
        action: showContact
    },
    'projects': {
        desc: 'View notable projects (coming soon)',
        action: showProjects
    },
    'resume': {
        desc: 'Download resume (coming soon)',
        action: downloadResume
    },
    'clear': {
        desc: 'Clear the terminal screen',
        action: clearTerminal
    },
    'ls': {
        desc: 'List available sections',
        action: listSections
    },
    'cat': {
        desc: 'Display file contents (try: cat about.txt)',
        action: catFile
    },
    'pwd': {
        desc: 'Show current directory',
        action: showPwd
    },
    'date': {
        desc: 'Show current date and time',
        action: showDate
    },
    'history': {
        desc: 'Show command history',
        action: showHistory
    }
};

let commandHistory = [];
let historyIndex = -1;
let currentSuggestionIndex = -1;

const input = document.getElementById('command-input');
const output = document.getElementById('output');
const suggestions = document.getElementById('suggestions');

window.addEventListener('load', () => {
    input.focus();
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.suggestions')) {
        input.focus();
    }
});

input.addEventListener('keydown', handleKeydown);
input.addEventListener('input', handleInput);

function handleKeydown(e) {
    const suggestionItems = suggestions.querySelectorAll('.suggestion-item');
    
    switch(e.key) {
        case 'Enter':
            e.preventDefault();
            if (suggestionItems.length > 0 && currentSuggestionIndex >= 0) {
                const selectedCommand = suggestionItems[currentSuggestionIndex].dataset.command;
                input.value = selectedCommand;
            }
            executeCommand();
            break;
            
        case 'Tab':
            e.preventDefault();
            if (suggestionItems.length > 0) {
                input.value = suggestionItems[0].dataset.command;
                hideSuggestions();
            }
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            if (suggestions.style.display === 'block' && suggestionItems.length > 0) {
                currentSuggestionIndex = Math.max(0, currentSuggestionIndex - 1);
                updateSuggestionSelection();
            } else {
                navigateHistory('up');
            }
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            if (suggestions.style.display === 'block' && suggestionItems.length > 0) {
                currentSuggestionIndex = Math.min(suggestionItems.length - 1, currentSuggestionIndex + 1);
                updateSuggestionSelection();
            } else {
                navigateHistory('down');
            }
            break;
            
        case 'Escape':
            hideSuggestions();
            break;
    }
}

function handleInput() {
    const value = input.value.trim().toLowerCase();
    if (value.length > 0) {
        showSuggestions(value);
    } else {
        hideSuggestions();
    }
}

function showSuggestions(query) {
    const matches = Object.keys(commands)
        .filter(cmd => cmd.toLowerCase().includes(query))
        .slice(0, 6);

    if (matches.length === 0) {
        hideSuggestions();
        return;
    }

    suggestions.innerHTML = matches.map((cmd, index) => 
        `<div class="suggestion-item" data-command="${cmd}" onclick="selectSuggestion('${cmd}')">
            <span>${cmd}</span>
            <span class="suggestion-desc">${commands[cmd].desc}</span>
        </div>`
    ).join('');

    suggestions.style.display = 'block';
    currentSuggestionIndex = 0;
    updateSuggestionSelection();
}

function updateSuggestionSelection() {
    const items = suggestions.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
        item.classList.toggle('selected', index === currentSuggestionIndex);
    });
}

function selectSuggestion(command) {
    input.value = command;
    hideSuggestions();
    input.focus();
}

function hideSuggestions() {
    suggestions.style.display = 'none';
    currentSuggestionIndex = -1;
}

function navigateHistory(direction) {
    if (commandHistory.length === 0) return;

    if (direction === 'up') {
        historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
    } else {
        historyIndex = Math.max(historyIndex - 1, -1);
    }

    if (historyIndex === -1) {
        input.value = '';
    } else {
        input.value = commandHistory[commandHistory.length - 1 - historyIndex];
    }
}

function executeCommand() {
    const command = input.value.trim();
    if (!command) return;

    commandHistory.push(command);
    historyIndex = -1;
    
    clearTerminal();
    appendOutput(`<div class="prompt-line"><span class="prompt">visitor@cv-terminal:~$</span> <span class="command">${command}</span></div>`);

    const [cmd, ...args] = command.toLowerCase().split(' ');
    
    if (commands[cmd]) {
        commands[cmd].action(args);
    } else {
        appendOutput(`<div class="error">Command not found: ${cmd}</div><div>Type 'help' to see available commands.</div>`);
    }

    input.value = '';
    hideSuggestions();
    
    setTimeout(() => {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

function appendOutput(content) {
    output.innerHTML += content + '<br>';
}

function showHelp() {
    appendOutput('<div class="success">Available Commands:</div>');
    appendOutput('<table class="table">');
    appendOutput('<tr><th>Command> \t</th><th>Description</th></tr>');
    
    Object.entries(commands).forEach(([cmd, info]) => {
        appendOutput(`<tr><td class="command">${cmd}>\t</td><td>${info.desc}</td></tr>`);
    });
    
    appendOutput('</table>');
    appendOutput('<div class="info">Use Tab for autocomplete or arrow keys to navigate suggestions.</div>');
}

function showWhoami() {
    appendOutput(`<div class="success">👨‍💻 ${cvData.name}</div>`);
    appendOutput(`<div class="info">📍 ${cvData.location}</div>`);
    appendOutput(`<div class="string">Backend Developer | Python Specialist | Cloud Enthusiast</div>`);
    appendOutput(`<div>💼 Currently trying to find opportunities</div>`);
    appendOutput(`<div>🎓 BS Information Technology Graduate</div>`);
    appendOutput(`<div>🚀 2+ years of professional development experience</div>`);
}

function showAbout() {
    appendOutput('<div class="success">About Me:</div>');
    appendOutput(`<div class="string">${cvData.summary}</div>`);
    appendOutput('<br><div class="info">What I love doing:</div>');
    appendOutput('<div>• Building scalable backend systems</div>');
    appendOutput('<div>• Designing efficient data pipelines</div>'); 
    appendOutput('<div>• Automating workflows and processes</div>');
    appendOutput('<div>• Solving complex technical challenges</div>');
    appendOutput('<div>• Learning new technologies</div>');
}

function showSkills() {
    appendOutput('<div class="success">Technical Skills & Competencies:</div>');
    
    Object.entries(cvData.skills).forEach(([category, skills]) => {
        appendOutput(`<div class="skill-category">${category}:</div>`);
        appendOutput(`<div class="skill-list">  ${skills.join(' • ')}</div>`);
    });
    
    appendOutput('<br><div class="info">Currently learning: React, Nodejs, and Go</div>');
}

function showExperience() {
    appendOutput('<div class="success">Work Experience:</div>');
    
    cvData.experience.forEach((exp, index) => {
        appendOutput(`<br><div class="command">${index + 1}. ${exp.company}</div>`);
        appendOutput(`<div class="string">   ${exp.position}</div>`);
        appendOutput(`<div class="info">   📅 ${exp.duration} | 📍 ${exp.location}</div>`);
        appendOutput(`<div class="warning">   Tech Stack: ${exp.techStack.join(', ')}</div>`);
        appendOutput(`<div>   Key Responsibilities:</div>`);
        exp.responsibilities.forEach(resp => {
            appendOutput(`<div>   • ${resp}</div>`);
        });
    });
}

function showEducation() {
    appendOutput('<div class="success">Education Background:</div>');
    
    cvData.education.forEach((edu, index) => {
        appendOutput(`<br><div class="command">${index + 1}. ${edu.institution}</div>`);
        appendOutput(`<div class="string">   ${edu.degree}</div>`);
        appendOutput(`<div class="info">   📅 ${edu.duration} | 📍 ${edu.location}</div>`);
    });
}

function showContact() {
    appendOutput('<div class="success">Contact Information:</div>');
    appendOutput(`<div>📧 Email: <span class="string">${cvData.email}</span></div>`);
    appendOutput(`<div>📱 Phone: <span class="string">${cvData.phone}</span></div>`);
    appendOutput(`<div>📍 Location: <span class="string">${cvData.location}</span></div>`);
    appendOutput(`<div>🐙 GitHub: <span class="string">${cvData.github}</span></div>`);
    appendOutput(`<div>💼 LinkedIn: <span class="string">${cvData.linkedin}</span></div>`);
    appendOutput('<br><div class="info">Feel free to reach out! I\'m always interested in discussing new opportunities.</div>');
}

function showProjects() {
    appendOutput('<div class="warning">Projects section coming soon!</div>');
    appendOutput('<div>I\'m currently working on showcasing my best projects here.</div>');
    appendOutput('<div class="info">In the meantime, check out my GitHub for code samples.</div>');
}

function downloadResume() {
    appendOutput('<div class="warning">Resume download coming soon!</div>');
    appendOutput('<div>I\'m preparing a downloadable PDF version of my resume.</div>');
    appendOutput('<div class="info">For now, you can use the \'experience\' and \'skills\' commands to see my background.</div>');
}

function clearTerminal() {
    output.innerHTML = `
        <div class="ascii-art">
        <pre>
░████████   ░█████████  ░██     ░██    ░███    ░███    ░██    ░██████████   ░███    ░████████      ░███    ░█████████  ░██████████   ░██████   
░██    ░██  ░██     ░██  ░██   ░██    ░██░██   ░████   ░██        ░██      ░██░██   ░██    ░██    ░██░██   ░██     ░██ ░██          ░██   ░██  
░██    ░██  ░██     ░██   ░██ ░██    ░██  ░██  ░██░██  ░██        ░██     ░██  ░██  ░██    ░██   ░██  ░██  ░██     ░██ ░██         ░██         
░████████   ░█████████     ░████    ░█████████ ░██ ░██ ░██        ░██    ░█████████ ░████████   ░█████████ ░█████████  ░█████████   ░████████  
░██     ░██ ░██   ░██       ░██     ░██    ░██ ░██  ░██░██        ░██    ░██    ░██ ░██     ░██ ░██    ░██ ░██   ░██   ░██                 ░██ 
░██     ░██ ░██    ░██      ░██     ░██    ░██ ░██   ░████        ░██    ░██    ░██ ░██     ░██ ░██    ░██ ░██    ░██  ░██          ░██   ░██  
░█████████  ░██     ░██     ░██     ░██    ░██ ░██    ░███        ░██    ░██    ░██ ░█████████  ░██    ░██ ░██     ░██ ░██████████   ░██████   
        </pre>
        </div>
        
        <div class="success">Welcome to my interactive CV terminal!</div>
        <div class="info">Type 'help' to see available commands or use Tab for suggestions.</div>
        <div class="warning">Pro tip: Try 'whoami', 'skills', 'experience', or 'contact'</div>
        <br>
    `;
}

function listSections() {
    appendOutput('<div class="success">Available sections:</div>');
    appendOutput('<div class="info">drwxr-xr-x  2 user user 4096 Jan 31 2025 <span class="command">about/</span></div>');
    appendOutput('<div class="info">drwxr-xr-x  2 user user 4096 Jan 31 2025 <span class="command">skills/</span></div>');
    appendOutput('<div class="info">drwxr-xr-x  2 user user 4096 Jan 31 2025 <span class="command">experience/</span></div>');
    appendOutput('<div class="info">drwxr-xr-x  2 user user 4096 Jan 31 2025 <span class="command">education/</span></div>');
    appendOutput('<div class="info">drwxr-xr-x  2 user user 4096 Jan 31 2025 <span class="command">contact/</span></div>');
    appendOutput('<div class="info">-rw-r--r--  1 user user  256 Jan 31 2025 <span class="string">about.txt</span></div>');
    appendOutput('<div class="info">-rw-r--r--  1 user user  512 Jan 31 2025 <span class="string">README.md</span></div>');
}

function catFile(args) {
    const filename = args[0];
    
    switch(filename) {
        case 'about.txt':
            appendOutput(`<div class="string">${cvData.summary}</div>`);
            break;
        case 'README.md':
            appendOutput('<div class="success"># CV Terminal</div>');
            appendOutput('<div>Interactive CV built with vanilla JavaScript</div>');
            appendOutput('<div>## Commands</div>');
            appendOutput('<div>- Type `help` for available commands</div>');
            appendOutput('<div>- Use Tab for autocomplete</div>');
            appendOutput('<div>- Use arrow keys for history/suggestions</div>');
            break;
        default:
            appendOutput(`<div class="error">cat: ${filename}: No such file or directory</div>`);
    }
}

function showPwd() {
    appendOutput('<div class="string">/home/visitor/cv-terminal</div>');
}

function showDate() {
    const now = new Date();
    appendOutput(`<div class="string">${now.toString()}</div>`);
}

function showHistory() {
    if (commandHistory.length === 0) {
        appendOutput('<div class="info">No commands in history yet.</div>');
    } else {
        commandHistory.forEach((cmd, index) => {
            appendOutput(`${cmd}`);
        });
    }
}

input.focus();
