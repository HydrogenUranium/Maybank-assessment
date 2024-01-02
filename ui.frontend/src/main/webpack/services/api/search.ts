import { Article } from "../../types/article";
import { get, simulateGet } from "./httpRequest";

export const getArticles = async (query: string): Promise<Article[]> => {
    return get({ url: `?query=${query}` });
};

export const getMockSuggestions = async (query: string): Promise<string[]> => {
    return simulateGet().then(() => {
        const words = query.split(' ');
        const lastWord = words.pop();
        const beginningOfSentence = words.join(' ');
        const matchingWords = wordArray.filter(word => word.startsWith(lastWord));
        const combinedSentences = matchingWords.map(word => `${beginningOfSentence} ${word}`);

        return combinedSentences.slice(0, 5);
    });
};

const wordArray = [
    "help", "(BBX)", "and", "M-commerce:", "work", "Understanding",
    "Upscaling", "Sporting", "EDM", "Shipping", "businesses", "Fashion",
    "Personal", "test", "demand", "manage", "Instruments", "designing", "screen", "how",
    "Textiles", "e-commerce", "Fast", "harder", "some", "steps", "too", "techniques", "in",
    "search", "Express", "stay", "marketing", "Top", "store", "optimize", "Breakbulk", "business",
    "the", "guide", "small", "every", "you", "Luxury", "control", "with", "productivity", "are",
    "improve", "The", "box", "Medical", "for", "delivery", "bootstrap", "Devices", "How", "fast?",
    "101", "customer", "plan", "apps", "loyalty", "online", "team’s", "Musical", "Consumer",
    "ultimate", "tips", "Make", "efficiently", "supercharge", "surges",
    "your", "7", "Electronics", "Goods", "a", "to", "Here"
];

export const getMockArticles = async (query: string): Promise<Article[]> => {
    return simulateGet().then(() => {
        const randomIndexes = new Set<number>();
        const resultArray = [];

        while (randomIndexes.size < 10) {
            const randomNumber = Math.floor(Math.random() * articleList.length);
            randomIndexes.add(randomNumber);
        }

        randomIndexes.forEach(index => {
            resultArray.push(articleList[index]);
        });

        return resultArray;
    });
};

const articleList: Article[] = [
    {
        title: "Upscaling too fast? Here are some tips to help you stay in control",
        link: "/content/dhl/global/en-global/small-business-advice/growing-your-business/controlling-your-growth.html",
        description: "Business development is a great thing, but you need to control rapid growth to keep the momentum. Read our expert advice on how to handle fast business growth.",
        image: "/content/dam/global-master/1-business-advice/growing-your-business/dis532-how-to-manage-rapid-business-growth/Mobile_1920x918DIS532-B.jpg",
        date: "November 30, 2023",
        author: "",
        groupTag: "#SmallBusinessAdvice-test",
        tags: []
    },
    {
        title: "The ultimate guide to designing a business plan",
        link: "/content/dhl/global/en-global/small-business-advice/starting-a-business/business-plan-advice.html",
        description: "Whether you starting a business or presenting a plan to investors or a bank, this guide will show you how to clarify your vision and plan for success.",
        image: "/content/dam/global-master/1-business-advice/starting-a-business/the-ultimate-guide-to-designing-a-business-plan/mobile_business_plan.jpg",
        date: "November 20, 2023",
        author: "James Rose",
        groupTag: "#SmallBusinessAdvice-test",
        tags: []
    },
    {
        title: "Top tips to improve customer loyalty with every delivery",
        link: "/content/dhl/global/en-global/small-business-advice/knowing-your-customer/thinking-inside-the-box.html",
        description: "Get ahead of other retailers by getting personal with your customers every time you deliver. Impress clients with a gift card or a handwritten thank you note.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/knowing-your-customer/top-tips-to-improve-customer-loyalty-with-every-delivery/Header_Mobile_CustomersAsBFFs_640x360px.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#SmallBusinessAdvice-test",
        tags: []
    },
    {
        title: "How to supercharge your team’s productivity",
        link: "/content/dhl/global/en-global/small-business-advice/growing-your-business/team-productivity-101.html",
        description: "Project managing a team? Apply these three easy techniques to your team today, taken from centuries of project management wisdom.",
        image: "/content/dam/global-master/1-business-advice/growing-your-business/dis398-team-productivity-101/Mobile_Tablet_991x558_A.jpg",
        date: "November 15, 2023",
        author: "Russell Simmons",
        groupTag: "#SmallBusinessAdvice-test",
        tags: []
    },
    {
        title: "Personal productivity apps and techniques",
        link: "/content/dhl/global/en-global/small-business-advice/starting-a-business/productivity-apps-and-techniques.html",
        description: "See our helpful round up of the most highly rated and popular apps designed to improve your business and your own productivity as well as task management.",
        image: "/content/dam/global-master/1-business-advice/starting-a-business/dis503-personal-productivity-apps-and-techniques/Mobile_Tablet_991x558_A.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#SmallBusinessAdvice-test",
        tags: []
    },
    {
        title: "How to bootstrap your business efficiently",
        link: "/content/dhl/global/en-global/small-business-advice/starting-a-business/bootstrapping-your-business.html",
        description: "Can you launch a startup or an SME without getting into debt? Read the basic guide for financing your company independently and running it your own way.",
        image: "/content/dam/global-master/1-business-advice/starting-a-business/wec0380-think-you-need-money-to-start-a-business/mobile_bootstrapping.jpg",
        date: "November 15, 2023",
        author: "James Rose",
        groupTag: "#SmallBusinessAdvice-test",
        tags: []
    },
    {
        title: "Make your search box work harder",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-best-practice/make-your-search-work-harder.html",
        description: "E-commerce businesses need a search function, find out how to make your search box work harder, and increase conversion rates with our comprehensive guide.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-best-practice/atl1570-make-your-search-box-work-harder/MOBILE_991X558_Make_your_website_search_box_work_harder_conversion_rate_optimization.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "Understanding Breakbulk Express (BBX) Shipping",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-best-practice/understand-break-bulk-express.html",
        description: "DHL Express Breakbulk can help consolidate your shipping and logistics in an efficient manner. Read more here.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-best-practice/understanding-breakbulk-express-shipping/Mobile_991x558_V01.jpg",
        date: "August 4, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "EDM marketing for e-commerce businesses",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-best-practice/edm-marketing.html",
        description: "Discover everything you need to know about EDM marketing and how you can build email marketing strategies to drive your e-commerce business with our guide.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-best-practice/wec0789-email-marketing-and-how-to-make-it-work-for-you/Mobile_991x558_V02.jpg",
        date: "May 30, 2023",
        author: "Garry Mockeridge",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "M-commerce: how to optimize your online store for the small screen",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-best-practice/mobile-commerce-small-screen-big-sales.html",
        description: "Discover more about mobile commerce, including some top tips on how to optimize your website for the mobile generation.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-best-practice/wec0769-mobile-commerce---small-screen,-big-sales-%28seo-refresh%29/Mobile_991x558_V01.jpg",
        date: "March 17, 2023",
        author: "Garry Mockeridge",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "7 steps to help your online store manage surges in demand",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-best-practice/steps-to-help-manage-surges-in-demand.html",
        description: "Is your e-commerce business truly prepared to deal with demand surges? If not, you could have some very disappointed customers on your hands. Read on for our top tips on how to prepare for the unpredictable.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-best-practice/wec0537-7-steps-to-help-your-online-store-manage-surges-in-demand/Mobile_991x558_V02%20%285%29.jpg",
        date: "May 13, 2022",
        author: "Anna Thompson",
        groupTag: "#eCommerceAdvice",
        tags: []
    },

    {
        title: "test",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-sector-guides/test.html",
        description: "",
        image: "",
        date: "November 29, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "Musical Instruments 101",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-sector-guides/musical-instruments-guide.html",
        description: "We look to investigate if the music industry is in declining or simply changing. Discover what this may mean for your business here.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-sector-guides/dis747-musical-instruments/06_Musical_Instruments_Desktop_1920x918@2x.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "Medical Devices 101",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-sector-guides/medical-devices-guide.html",
        description: "Medical devices have made health more mobile by allowing anyone to access medical services from their own home. Learn more about these sector changes here.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-sector-guides/dis680-medical-devices/09_Medical_Devices_Desktop_1920x918@2x.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "Textiles 101",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-sector-guides/textile-industry-guide.html",
        description: "Recent developments in smart and sustainable textiles have revolutionised the industry. Learn how this shift could affect your business offering here.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-sector-guides/dis678-textiles/08_Textiles_Desktop_1920x918@2x.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "Sporting Goods 101",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-sector-guides/sporting-goods-guide.html",
        description: "The health and business sector has seen formidable business growth in recent years. See how your business can take advantage of this booming sector.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-sector-guides/dis673-sporting-goods/Sporting-Goods-Desktop-1920x918@2x.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "Luxury Goods 101",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-sector-guides/luxury-goods-guide.html",
        description: "The luxury goods sector is booming. Discover what changes have come with this business growth and what it means for your ecommerce.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-sector-guides/dis675-luxury-goods/04_Luxury_Goods_Cosmetics_Desktop_1920x918@2x.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "Fast Fashion 101",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-sector-guides/fast-fashion-guide.html",
        description: "The fashion industry is constantly changing at an ever increasing speed. Read about the changes to shipping and rise in sustainability concerns here.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-sector-guides/dis672-fast-fashion/Header1_991x558px@2x.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    },
    {
        title: "Consumer Electronics 101",
        link: "/content/dhl/global/en-global/e-commerce-advice/e-commerce-sector-guides/consumer-electronics-guide.html",
        description: "With more innovative consumer electric goods hitting the mainstream we’ve collated an expert guide on everything you need to know about the sector.",
        image: "/content/dam/global-master/2-global-e-commerce-advice/e-commerce-sector-guides/dis671-consumer-electronics/Desktop_1920x918@2x.jpg",
        date: "November 15, 2023",
        author: "",
        groupTag: "#eCommerceAdvice",
        tags: []
    }
];
