function CreateEmbed({EmbedBuilder}) {

    function newE({success = undefined, title, desc, icon, image, fields}) {
        if (success === undefined) {
            color = "#4169E1"
        } else {
            color = (!success) ? "#d42117" : "#42f55d";
        }

        const iconURL = (icon) ? icon : undefined
        const imageURL = (image) ? image : undefined

        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setDescription(`${desc}`)
            .setColor(color)
            .setURL(undefined)
            .setThumbnail(iconURL)
            .setImage(imageURL)
            .setTimestamp()
            .setFooter({ text: "www.noaribote.fr", iconURL: 'https://noaribote.fr/assets/images/logo.png' });
        
        if (fields) {
            for (let index = 0; index < fields.length; index++) {
                embed.addFields(fields[index])
            }
        }

        return embed;
    };

    return { newE };
}

module.exports = { CreateEmbed }
