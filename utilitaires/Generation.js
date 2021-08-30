// Déportation de tous les modules nécessaires.
module.exports = {
    ChargeActivePourLIdentifiant: (Courriel) => {
        return ('id=' + Courriel
        + '&type=EMAIL'
        + '&matchType=EXACT'
        + '&extensionSet.extensionNames=HANGOUTS_ADDITIONAL_DATA'
        + '&extensionSet.extensionNames=HANGOUTS_OFF_NETWORK_GAIA_LOOKUP'
        + '&extensionSet.extensionNames=HANGOUTS_PHONE_DATA'
        + '&coreIdParams.useRealtimeNotificationExpandedAcls=true'
        + '&requestMask.includeField.paths=person.email'
        + '&requestMask.includeField.paths=person.gender'
        + '&requestMask.includeField.paths=person.in_app_reachability'
        + '&requestMask.includeField.paths=person.metadata'
        + '&requestMask.includeField.paths=person.name'
        + '&requestMask.includeField.paths=person.phone'
        + '&requestMask.includeField.paths=person.photo'
        + '&requestMask.includeField.paths=person.read_only_profile_info'
        + '&requestMask.includeContainer=AFFINITY'
        + '&requestMask.includeContainer=PROFILE'
        + '&requestMask.includeContainer=DOMAIN_PROFILE'
        + '&requestMask.includeContainer=ACCOUNT'
        + '&requestMask.includeContainer=EXTERNAL_ACCOUNT'
        + '&requestMask.includeContainer=CIRCLE'
        + '&requestMask.includeContainer=DOMAIN_CONTACT'
        + '&requestMask.includeContainer=DEVICE_CONTACT'
        + '&requestMask.includeContainer=GOOGLE_GROUP'
        + '&requestMask.includeContainer=CONTACT');
    },
    EntêtesPourLIdentifiant: (Autorisation, TémoinsDeConnexion) => {
        return ({
            'X-HTTP-Method-Override': 'GET',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin' : 'https://hangouts.google.com',
            'Authorization': Autorisation,
            'Cookie': TémoinsDeConnexion
        });
    },
    ChargeActivePourLaDonnée: (internal_token) => {
        return ( '&request_mask.include_container=PROFILE'
            + '&request_mask.include_container=DOMAIN_PROFILE'
            + '&request_mask.include_field.paths=person.metadata.best_display_name'
            + '&request_mask.include_field.paths=person.photo'
            + '&request_mask.include_field.paths=person.email'
            + '&core_id_params.enable_private_names=true'
            + '&key=' + internal_token
        );
    },
    EntêtesPourLaDonnée: (Autorisation, TémoinsDeConnexion) => {
        return ({
            'Host': 'people-pa.clients6.google.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0',
            'Authorization': Autorisation,
            'Origin' : 'https://drive.google.com',
            'Connection': 'Keep-Alive',
            'Cookie': TémoinsDeConnexion
        });
    }
}