import { vehicleStore } from './vehicleStore';
import { shipmentStore } from './shipmentStore';
import { notificationStore } from './notificationStore';

// Simple intent-based logic engine
export const assistantLogic = {
    processQuery: (text, language = 'en') => {
        const query = text.toLowerCase();
        
        // 1. Language Handling (Mock translations for outputs)
        const t = (en, hi, te) => {
            if (language === 'hi') return hi || en;
            if (language === 'te') return te || en;
            return en;
        };

        // 2. Intent Recognition

        // --- GREETING (Strict Word Boundaries) ---
        if (query.match(/\b(hello|hi|hey|namaste|greetings)\b/)) {
            return t(
                "Hello! How can I help you with your logistics today?",
                "नमस्ते! मैं आपके रसद (logistics) में आपकी कैसे मदद कर सकता हूँ?",
                "నమస్తే! మీ లాజిస్టిక్స్ అవసరాలకు నేను ఎలా సహాయపడగలను?"
            );
        }

        // --- ADD VEHICLE HELP ---
        if ((query.includes('add') || query.includes('create') || query.includes('new')) && (query.includes('vehicle') || query.includes('truck') || query.includes('lorry'))) {
            return t(
                "To add a new vehicle: Go to the 'My Vehicles' page and click the '+ Add Vehicle' button.",
                "नया वाहन जोड़ने के लिए: 'My Vehicles' पेज पर जाएं और '+ Add Vehicle' बटन पर क्लिक करें।",
                "నయా వాహనం జోడించడానికి: 'My Vehicles' పేజీకి వెళ్లి '+ Add Vehicle' బటన్‌పై క్లిక్ చేయండి."
            );
        }

        // --- ADD SHIPMENT HELP ---
        if ((query.includes('add') || query.includes('create') || query.includes('new')) && (query.includes('shipment') || query.includes('deal') || query.includes('load'))) {
            return t(
                "You can manage shipments from the 'Shipments' page. Use the filter to see Pending or In-Transit loads.",
                "आप 'Shipments' पेज से शिपमेंट प्रबंधित कर सकते हैं। पेंडिंग या इन-ट्रांसिट लोड देखने के लिए फ़िल्टर का उपयोग करें।",
                "మీరు 'Shipments' పేజీ నుండి షిప్‌మెంట్‌లను నిర్వహించవచ్చు."
            );
        }

        // --- SHIPMENTS IN TRANSIT (Data Query) ---
        if (query.includes('transit') || query.includes('route') || query.includes('track')) {
            const shipments = shipmentStore.getAll().filter(s => ['On Route', 'In Transit'].includes(s.status));
            const count = shipments.length;
            
            if (count === 0) {
                return t(
                    "You currently have no shipments in transit.",
                    "वर्तमान में आपके पास पारगमन (transit) में कोई शिपमेंट नहीं है।",
                    "ప్రస్తుతం మీకు ట్రాన్సిట్‌లో ఎటువంటి షిప్‌మెంట్‌లు లేవు."
                );
            }

            const first = shipments[0];
            return t(
                `You have ${count} shipment(s) in transit. The next one is from ${first.origin} to ${first.destination}. Cargo: ${first.cargo}.`,
                `आपके ${count} शिपमेंट ट्रांजिट में हैं। अगला ${first.origin} से ${first.destination} तक है। कार्गो: ${first.cargo}।`,
                `మీకు ${count} షిప్‌మెంట్‌లు ట్రాన్సిట్‌లో ఉన్నాయి. తదుపరిది ${first.origin} నుండి ${first.destination} వరకు ఉంది.`
            );
        }

        // --- DEALS ACCEPTED (Data Query) ---
        if (query.includes('accepted') || query.includes('deals') || query.includes('requests')) {
            const notifications = notificationStore.getAll().filter(n => n.status === 'accepted');
            const count = notifications.length;

            return t(
                `You have accepted ${count} deals from farmers this week.`,
                `आपने इस सप्ताह किसानों से ${count} सौदे स्वीकार किए हैं।`,
                `మీరు ఈ వారం రైతుల నుండి ${count} ఒప్పందాలను అంగీకరించారు.`
            );
        }
        
        // --- FLEET SIZE / MY VEHICLES (Data Query) ---
        // Handles: "my vehicles", "fleet size", "how many trucks", "vehicle account" (fuzzy match context)
        if (query.includes('fleet') || query.includes('vehicle') || query.includes('truck') || query.includes('lorry')) {
             const vehicles = vehicleStore.getAll();
             const count = vehicles.length;
             return t(
                 `You have ${count} vehicles registered in your fleet. You can manage them in the 'My Vehicles' section.`,
                 `आपके बेड़े में कुल ${count} वाहन पंजीकृत हैं। आप उन्हें 'My Vehicles' अनुभाग में प्रबंधित कर सकते हैं।`,
                 `మీ ఫ్లీట్‌లో మొత్తం ${count} వాహనాలు నమోదయ్యాయి.`
             );
        }

        // --- FALLBACK ---
        return t(
            "I'm not sure I understood that. You can ask about your 'shipments', 'vehicles', or 'routes'.",
            "क्षमा करें, मुझे समझ नहीं आया। आप अपने 'शिपमेंट', 'वाहन' या 'रूट' के बारे में पूछ सकते हैं।",
            "క్షమించండి, నాకు అర్థం కాలేదు. మీరు మీ 'షిప్‌మెంట్‌లు', 'వాహనాలు' లేదా 'రూట్‌ల' గురించి అడగవచ్చు."
        );
    }
};
