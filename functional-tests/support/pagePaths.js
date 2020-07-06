export const pagePaths = {
	"not found": "/random-route/",
	home: "/",
	about: "/about/",
	development: "/about/development/",
	"specialities list": "/specialities/",
	"allergies speciality": "/specialities/allergies/",
	"what's new": "/whats-new/",
	"topics list": "/topics/",
	"achilles tendinopathy topic": "/topics/achilles-tendinopathy/",
};

export const getPath = (pageName) => {
	const path = pagePaths[pageName];

	if (!path) throw new Error(`Path for page ${pageName} could not be resolved`);

	return path;
};
