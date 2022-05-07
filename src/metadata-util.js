import { tsToVodTime, vodTimeToTs } from './time-util';

/**
 * Read the metadata object and returns an object containing the metadata by streamer and the metadata by video id
 * @param allmeta
 * @return {{metaByStreamer: {}, metaByVid: {}}}
 */
export function prepareMetadata(allmeta) {
  const metaByVid = {};
  const metaByStreamer = {};
  
  let persistedDetailed = 0;
  let persisted = 0;
  let nonPersisted = 0;
  let persistedDuration = 0;
  let totalDuration = 0;
  
  const streamerNames = Object.keys(allmeta).sort((a,b) => {
    return a.localeCompare(b);
  });
  
  streamerNames.forEach(streamer => {
    const streamerMeta = allmeta[streamer];
    metaByStreamer[streamer] = {};
    Object.values(streamerMeta).forEach(vodMeta => {
      vodMeta.duration_ms = vodTimeToTs(vodMeta.duration);
      vodMeta.duration_ms_orig = vodMeta.duration_ms;
      totalDuration += vodMeta.duration_ms;
      
      vodMeta.permanent_ids = vodMeta.permanent_ids || [];
      
      const permanent_ids = [ ...vodMeta.permanent_ids ];
      delete vodMeta.permanent_ids;
      if (permanent_ids?.length > 0) {
        persisted++;
        persistedDetailed += permanent_ids?.length;
        
        permanent_ids.forEach((permanentVod, index) => {
          const persistedVodMeta = { ...vodMeta };
          persistedVodMeta.id = `${persistedVodMeta.id}-${index + 1}`;
          const delayCreated = permanentVod.created_delay || 0;
          persistedVodMeta.createdTs = persistedVodMeta.created_ts + delayCreated;
          
          if (permanentVod.duration) {
            persistedVodMeta.duration_ms = permanentVod.duration;
          }
          
          persistedDuration += persistedVodMeta.duration_ms;
          
          persistedVodMeta.permanent_id = permanentVod;
          metaByVid[`${permanentVod.id}<${persistedVodMeta.id}`] = persistedVodMeta;
          metaByStreamer[streamer][persistedVodMeta.id] = persistedVodMeta;
        });
        
        //console.log(`${vodMeta.permanent_id.id}<${vodMeta.id}`)
      }
      else {
        metaByVid[vodMeta.id] = vodMeta;
        metaByStreamer[streamer][vodMeta.id] = vodMeta;
        vodMeta.createdTs = vodMeta.created_ts;
        nonPersisted++;
      }
    });
  });
  
  const total = persisted+nonPersisted;
  const totalDetailed = persistedDetailed+nonPersisted;
  console.debug('');
  console.debug('');
  console.debug('');
  console.debug(
    `--------------- STATS ---------------
Persisted videos: ${persisted} / ${total} (${Math.round(10000*persisted/total)/100}%)
Persisted videos (with split count): ${persistedDetailed} / ${totalDetailed} (${Math.round(10000*persistedDetailed/totalDetailed)/100}%)
Persisted duration: ${tsToVodTime(persistedDuration)} / ${tsToVodTime(totalDuration)} (${Math.round(10000*persistedDuration/totalDuration)/100}%)
-------------------------------------`
  );
  console.debug('');
  console.debug('');
  console.debug('');

  return { metaByStreamer, metaByVid };
}
