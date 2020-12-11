export const pagePaths = {
	"not found": "/random-route/",
	home: "/",
	about: "/about/",
	development: "/about/development/",
	"specialities list": "/specialities/",
	"allergies speciality": "/specialities/allergies/",
	"what's new": "/whats-new/",
	"topics list": "/topics/",
	"asthma topic": "/topics/asthma/",
	"asthma have I got the right topic?":
		"/topics/asthma/have-i-got-the-right-topic/",
	"achilles tendinopathy topic": "/topics/achilles-tendinopathy/",
	search: "/search/",
};

export type PageName = keyof typeof pagePaths;

export const getPath = (pageName: PageName) => {
	const path = pagePaths[pageName];

	if (!path) throw `Path for page ${pageName} could not be resolved`;

	return path;
};
