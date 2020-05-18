import { When } from "cucumber";
import "@nice-digital/wdio-cucumber-steps/lib/when";

import enterPartialTopicNameInSearchBox from "./../support/action/enterPartialTopicNameInSearchBox";

When(
	"I type the first 3 characters of a topic name in the header search box",
	enterPartialTopicNameInSearchBox
);
