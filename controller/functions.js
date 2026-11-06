function AllFunctionsController({client, activities}) {
    let activityIndex = 0;
    function changeActivity() {
        const activity = activities[activityIndex];
        if (typeof activity.name === 'function') {
            client.user.setActivity(activity.name(client), { type: activity.type, status: activity.status, url: activity.url });
        } else {
            client.user.setActivity(activity.name, { type: activity.type, status: activity.status, url: activity.url });
        }

        activityIndex = (activityIndex + 1) % activities.length;
        setTimeout(changeActivity, 5000);
    };

    return { changeActivity };
}

module.exports = { AllFunctionsController }