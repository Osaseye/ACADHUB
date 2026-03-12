import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { faker } from '@faker-js/faker';

export const generateMockProjects = async (db, count = 250) => {
    const departments = ['Computer Science', 'Economics', 'Engineering', 'Law', 'Business Administration', 'Agriculture'];
    const projectTypes = ['BSc Project', 'MSc Dissertation', 'PhD Thesis'];
    
    // Tech / Real-world research titles
    const titleTemplates = [
        "Analysis of Artificial Intelligence in {{department}}",
        "A Deep Dive into {{department}} Systems Architecture",
        "Machine Learning Approaches for Solving Issues in {{department}}",
        "Impact of Global Economic Changes on {{department}}",
        "The Role of Blockchain Technology within {{department}}",
        "Comparative Study of Distributed Computing in {{department}}",
        "Data-Driven Discoveries and Trends in {{department}}",
        "An Optimization Model for {{department}} Real-time Applications"
    ];

    const generateTitle = (dept) => {
        const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
        return template.replace('{{department}}', dept);
    };

    const promises = [];

    const projectRef = collection(db, "projects");

    for (let i = 0; i < count; i++) {
        const dept = departments[Math.floor(Math.random() * departments.length)];
        const degree = projectTypes[Math.floor(Math.random() * projectTypes.length)];
        const title = generateTitle(dept);

        const project = {
            title: title + " - A case study " + faker.location.city(),
            abstract: faker.lorem.paragraphs(3),
            type: degree,
            department: dept,
            year: faker.number.int({ min: 2022, max: 2026 }),
            supervisorId: 'mock-supervisor-' + faker.string.alphanumeric(5),
            supervisorName: "Dr. " + faker.person.lastName(),
            studentId: 'mock-student-' + faker.string.alphanumeric(5),
            studentName: faker.person.fullName(),
            institution: faker.company.name() + " University",
            status: 'verified', // Pre-verified so they show up
            createdAt: new Date(faker.date.past({ years: 2 })), // Random date from past 2 years
            views: faker.number.int({ min: 10, max: 5000 }),
            downloads: faker.number.int({ min: 0, max: 800 }),
            citations: faker.number.int({ min: 0, max: 50 }),
            plagiarismScore: faker.number.int({ min: 0, max: 15 }),
            fileUrl: 'https://example.com/mock.pdf',
            fileName: faker.system.fileName() + '.pdf',
            keywords: faker.word.words(5).split(' ').join(', '),
        };

        promises.push(addDoc(projectRef, project));
    }

    await Promise.all(promises);
};
