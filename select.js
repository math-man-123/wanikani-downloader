// This script fills the content selection field with all options.
// Having this done by a script makes the index.html much cleaner.
const SELECT = document.getElementById('content');


// Define SRS stages with corresponding values and labels
const STAGES = [
    { value: 'srs1,2,3,4', label: 'Apprentice' },
    { value: 'srs5,6', label: 'Guru' },
    { value: 'srs7', label: 'Master' },
    { value: 'srs8', label: 'Enlightened' },
    { value: 'srs9', label: 'Burned' },
];

// Create a new optgroup for SRS stages
let group = document.createElement('optgroup');
group.label = 'SRS-STAGES';

// Add an option for each SRS stage to the optgroup
for (let { value, label } of STAGES)
    group.appendChild(new Option(label, value));

SELECT.appendChild(group);


// Define level ranges and their category labels
const LEVELS = {
    '快 PLEASANT': [1, 10],
    '苦 PAINFUL': [11, 20],
    '死 DEATH': [21, 30],
    '地獄 HELL': [31, 40],
    '天国 PARADISE': [41, 50],
    '現実 REALITY': [51, 60],
};

// For each level category, create a labeled optgroup and add level options
for (let [label, data] of Object.entries(LEVELS)) {
    let group = document.createElement('optgroup');
    group.label = label;

    // Add each level option to the optgroup
    let [start, end] = data;
    for (let i = start; i <= end; i++)
        group.appendChild(new Option(`Level ${i}`, `level${i}`));

    SELECT.appendChild(group);
}
