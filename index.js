require('dotenv').config()

const Courriel = process.argv[2];

const Réclamation = require('axios');

const Generation = require('./utilitaires/Generation');

const TémoinDeConnexion = 
    'SID=' + process.env.SID
    + 'SSID=' + process.env.SSID
    + 'APISID=' + process.env.APISID
    + 'SAPISID=' + process.env.SAPISID
    + 'HSID=' + process.env.HSID
    + 'CONSENT=YES+FR.fr+V10+BX;'
    + 'PREF=tz=Europe.Paris&f6=40000000&hl=en;';

const AdresseRéticulaire = 'https://people-pa.clients6.google.com';

const LienIdentifiant = '/v2/people/lookup?key=';
const LienDonnées = '/v2/people?person_id=';

const AuthentificationPrimaire = 'SAPISIDHASH ' + process.env.SAPISIDHASH_ID;
const JetonPrimaire = process.env.SAPISIDTOKEN_ID;

const AuthentificationInterne = 'SAPISIDHASH ' + process.env.SAPISIDHASH_DATA;
const JetonInterne = process.env.SAPISIDTOKEN_DATA;

const RécupérerIdentifiant = (Courriel) => {
    return new Promise ((Résolution, Rejet) => {
        if (JetonPrimaire && AuthentificationPrimaire && Courriel) {
            Réclamation({
                'method': 'POST',
                'url': AdresseRéticulaire + LienIdentifiant + JetonPrimaire,
                'data': Generation.ChargeActivePourLIdentifiant(Courriel),
                'headers': Generation.EntêtesPourLIdentifiant(AuthentificationPrimaire, TémoinDeConnexion)
            })
            .then((Réponse) => {
                if (Réponse.data.matches) {
                    Résolution(Réponse.data)
                }
                else {
                    Rejet('Ce compte n\'est pas utilisé sur Google mon brave!');
                }
            })
            .catch(() => {
                Rejet('La réclamation des informations à échoué.');
            })
        }
        else {
            Rejet('Un paramètre semble manquant, vérifiez votre fichier d\'environnement.');
        }
    })
}

const RécupérerDonnées = (IdentifiantGoogle, ObjetDeRetour) => {
    return new Promise ((Résolution, Rejet) => {
        if (JetonInterne && AuthentificationInterne && IdentifiantGoogle) {
            Réclamation({
                'method': 'GET',
                'url': AdresseRéticulaire + LienDonnées + IdentifiantGoogle + Generation.ChargeActivePourLaDonnée(JetonInterne),
                'headers': Generation.EntêtesPourLaDonnée(AuthentificationInterne, TémoinDeConnexion),
            })
            .then((Réponse) => {
                ObjetDeRetour['Nom'] = Réponse.data.personResponse[0].person.metadata.bestDisplayName.displayName;
                ObjetDeRetour['Portrait'] = Réponse.data.personResponse[0].person.photo[0].url;
                Résolution(ObjetDeRetour);
            })
            .catch(() => {
                Rejet('La réclamation des informations à échoué.');
            })
        }
        else {
            Rejet('Un paramètre semble manquant, vérifiez votre fichier d\'environnement.');
        }
    })
}

RécupérerIdentifiant(Courriel)
.then((Réponse) => {
 
    let ObjetDeRetour = {};

    ObjetDeRetour['IdentifiantGoogle'] = Réponse.matches[0].personId[0];
    ObjetDeRetour['DernièreMiseÀJour'] = new Date(parseInt(Réponse.people[ObjetDeRetour['IdentifiantGoogle']].metadata.lastUpdateTimeMicros)).toString()
    
    return RécupérerDonnées(ObjetDeRetour['IdentifiantGoogle'], ObjetDeRetour)
})
.then((ObjetBienRempli) => {
    console.log('\033[32mNom d\'usage\033[0m: ' + ObjetBienRempli['Nom']);
    console.log('\033[32mIdentifiant Google\033[0m: ' + ObjetBienRempli['IdentifiantGoogle']);
    console.log('\033[32mLien du portrait\033[0m: ' + ObjetBienRempli['Portrait']);
    console.log('\033[32mCollection de portraits\033[0m: https://get.google.com/albumarchive/' + ObjetBienRempli['IdentifiantGoogle'] + '/albums/profile-photos')
    console.log('\033[32mAvis émis sur la carte Google\033[0m: https://www.google.com/maps/contrib/' + ObjetBienRempli['IdentifiantGoogle'])
    console.log('\033[32mDernière mise à jour\033[0m: ' + ObjetBienRempli['DernièreMiseÀJour']);
})
.catch((Erreur) => {
    console.error(Erreur);
})