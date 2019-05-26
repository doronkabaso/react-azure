export const tagsLabels = Object.freeze({
    rightSpeakerTag: '<ימין>',
    leftSpeakerTag: '<שמאל>',
    speakerTagNumber: '<number>',
    speakerIdPrefix: '<דובר ', //purposely without ending tag
    laughterTag: '{לפ}',
    breathingTag: '{בנ}',
    coughingTag: '{כפ}',
    cluckingTag: '{מנ}',
    humanBackgroundNoiseTag: '{עב}',
    stutteringTag: '{גמ}',
    hummingTag: '{הנ}',
    incoherentTag: '{לב}',
    nonHumanBackgroundNoiseTag: '{אמ}',
    phoneInterfaceNoiseTag: '{דת}',
    lineInterferenceTag: '{שד}',
    hesitationTag: '{הס}',
    cryingTag: '{בכ}',
    voiceMailTag: '{מק}',
    computerEnvSound: '{מח}',
    bell: '{פע}',
    tacticalPTT_Noise: '{טק}',
    praying: '{מס}',
    vehicle: '{רכ}',
    television: '{טב}',
    doorSlam: '{דל}',
    cleaningNoise: '{ספ}',
});
export const tagsLabelsEvents = Object.freeze({
    laughterTag: {
        shortcut: '{לפ}',
        label: {
            Hebrew: 'צחוק',
            English: 'Add Laughter Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+m',
        keyCode: 77
    },
    breathingTag: {
        shortcut: '{בנ}',
        label: {
            Hebrew: 'התנשמות',
            English: 'Add Breathing Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+b',
        keyCode: 66
    },
    coughingTag: {
        shortcut: '{כפ}',
        label: {
            Hebrew: 'שיעול / התעטשות ',
            English: 'Add Coughing/Sneezing/Hiccupping Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+t',
        keyCode: 84
    },
    cluckingTag: {
        shortcut: '{מנ}',
        label: {
            Hebrew: 'תנועת שפתיים וצקצוק',
            English: 'Add Clucking Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+o',
        keyCode: 79
    },
    humanBackgroundNoiseTag: {
        shortcut: '{עב}',
        label: {
            Hebrew: 'רעש רקע אנושי',
            English: 'Add Human Background Noise Tag'
        },
        eventSound: {
            Hebrew: 'דיבור ברקע של אנשים, קולות של אנשים שאינם חלק מהשיחה וכו..',
            English: ''
        },
        shortcutKeys: 'Alt+h',
        keyCode: 72
    },
    stutteringTag: {
        shortcut: '{גמ}',
        label: {
            Hebrew: 'גמגום',
            English: 'Add Stuttering Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+g',
        keyCode: 71
    },
    hummingTag: {
        shortcut: '{הנ}',
        label: {
            Hebrew: 'הנהון (מממ...)',
            English: 'Add Humming Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+q',
        keyCode: 81
    },
    incoherentTag: {
        shortcut: '{לב}',
        label: {
            Hebrew: 'מילה לגמרי לא ברורה',
            English: 'Add Incoherent Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+p',
        keyCode: 80
    },
    nonHumanBackgroundNoiseTag: {
        shortcut: '{אמ}',
        label: {
            Hebrew: 'רעש רקע שאינו אנושי',
            English: 'Add Environmental Noise (Animals, Ringtones, etc.) Tag'
        },
        eventSound: {
            Hebrew: 'קולות של חיות, מכשירים רועשים וכדומה',
            English: ''
        },
        shortcutKeys: 'Alt+j',
        keyCode: 74
    },
    phoneInterfaceNoiseTag: {
        shortcut: '{דת}',
        label: {
            Hebrew: 'צפצופי טלפון',
            English: 'Add Phone Interface Noise Tag'
        },
        eventSound: {
            Hebrew: 'רעש של הקלדה בטלפון, צלצול או כל רעש המופק מטלפון, הודעה בנייד, רטט בנייד',
            English: ''
        },
        shortcutKeys: 'Alt+l',
        keyCode: 76
    },
    lineInterferenceTag: {
        shortcut: '{שד}',
        label: {
            Hebrew: 'הפרעות בקו',
            English: 'Add Line Interference Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+a',
        keyCode: 65
    },
    hesitationTag: {
        shortcut: '{הס}',
        label: {
            Hebrew: 'היסוס ("אהה") לפני דיבור',
            English: 'Add Hesitation Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+w',
        keyCode: 87
    },
    cryingTag: {
        shortcut: '{בכ}',
        label: {
            Hebrew: 'בכי',
            English: 'Add Crying Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+c',
        keyCode: 67
    },
    voiceMailTag: {
        shortcut: '{מק}',
        label: {
            Hebrew: 'מענה קולי',
            English: 'Add Voicemail Tag'
        },
        eventSound: {
            Hebrew: '(**הערה – בהתאם להנחיות – ישוקלט המענה הקולי, בנוסף לסמן).',
            English: ''
        },
        shortcutKeys: 'Alt+n',
        keyCode: 78
    },
    computerEnvSound: {
        shortcut: '{מח}',
        label: {
            Hebrew: 'רעש מחשב',
            English: 'Computer Noise Tag'
        },
        eventSound: {
            Hebrew: 'הקלדה במקלדת, כיבוי/הדלקה של מחשב',
            English: ''
        },
        shortcutKeys: 'Alt+u',
        keyCode: 85
    },
    bell: {
        shortcut: '{פע}',
        label: {
            Hebrew: 'רעש פעמון - קטיעת שיחה',
            English: 'Bell Noise Tag'
        },
        eventSound: {
            Hebrew: 'כששיחה נקטעת כתוצאה מהגבלה בו"ז, צליל של פעמון',
            English: ''
        },
        shortcutKeys: 'Alt+i',
        keyCode: 73
    },
    tacticalPTT_Noise: {
        shortcut: '{טק}',
        label: {
            Hebrew: 'רעש PTT בקשר טקטי',
            English: 'Tactical PTT Noise Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: 'Alt+k',
        keyCode: 75
    },
    praying: {
        shortcut: '{מס}',
        label: {
            Hebrew: 'רעש תפילה',
            English: 'Praying Noise Tag'
        },
        eventSound: {
            Hebrew: 'קולות ממסגד, מואזין, תפילות שונות',
            English: ''
        },
        shortcutKeys: 'Alt+z',
        keyCode: 90
    },
    vehicle: {
        shortcut: '{רכ}',
        label: {
            Hebrew: 'כלי רכב/תחבורה',
            English: 'Vehicles Noise Tag'
        },
        eventSound: {
            Hebrew: 'קולות הבאים ממכוניות, אוטובוסים, אופנועים וכו.. כל כלי רכב שהוא, מחרטה, כביש ו/או מכוניות חולפות ',
            English: ''
        },
        shortcutKeys: 'Alt+x',
        keyCode: 88
    },
    television: {
        shortcut: '{טב}',
        label: {
            Hebrew: 'רעש מטלוויזיה',
            English: 'Televison Noise Tag'
        },
        eventSound: {
            Hebrew: 'תכניות, כיבוי/הדלקה',
            English: ''
        },
        shortcutKeys: 'Alt+v',
        keyCode: 86
    },
    doorSlam: {
        shortcut: '{דל}',
        label: {
            Hebrew: 'סגירה/טריקה של דלת',
            English: 'Door Slam Noise Tag'
        },
        eventSound: {
            Hebrew: '',
            English: ''
        },
        shortcutKeys: '<'+'+Alt',
        keyCode: 188
    },
    cleaningNoise: {
        shortcut: '{ספ}',
        label: {
            Hebrew: 'רעשי ניקיון',
            English: 'Cleaning Noise Tag'
        },
        eventSound: {
            Hebrew: 'עבודות ניקיון',
            English: ''
        },
        shortcutKeys: '>'+'+Alt',
        keyCode: 190
    },
});

