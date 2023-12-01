export async function acceptEULA(): Promise<void> {
	const EULAAcceptButton = await $("#btn-accept-cks-eula");

	if (await EULAAcceptButton.isDisplayed()) await EULAAcceptButton.click();
}
