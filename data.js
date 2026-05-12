// AquaLog - Shared Data Layer
// All data stored in localStorage, no backend required

const AquaDB = {
  // ── Auth ──────────────────────────────────────────────
  getUser() { return JSON.parse(localStorage.getItem('aqualog_user') || 'null'); },
  setUser(u) { localStorage.setItem('aqualog_user', JSON.stringify(u)); },
  logout() {
    localStorage.removeItem('aqualog_user');
    if (window.AquaUI?.navigate) window.AquaUI.navigate('auth.html');
    else window.location.href = 'auth.html';
  },
  requireAuth() {
    if (!this.getUser()) {
      if (window.AquaUI?.navigate) window.AquaUI.navigate('auth.html');
      else window.location.href = 'auth.html';
      return false;
    }
    return true;
  },

  // ── Tanks ─────────────────────────────────────────────
  getTanks() { return JSON.parse(localStorage.getItem('aqualog_tanks') || '[]'); },
  saveTanks(t) { localStorage.setItem('aqualog_tanks', JSON.stringify(t)); },
  addTank(tank) {
    const tanks = this.getTanks();
    tank.id = Date.now().toString();
    tank.createdAt = new Date().toISOString();
    tanks.push(tank);
    this.saveTanks(tanks);
    return tank;
  },
  updateTank(id, data) {
    const tanks = this.getTanks().map(t => t.id === id ? { ...t, ...data } : t);
    this.saveTanks(tanks);
  },
  deleteTank(id) {
    this.saveTanks(this.getTanks().filter(t => t.id !== id));
    // Cascade delete related data
    this.saveTests(this.getTests().filter(t => t.tankId !== id));
    this.saveLogs(this.getLogs().filter(l => l.tankId !== id));
    this.saveLivestock(this.getLivestock().filter(l => l.tankId !== id));
  },
  getTank(id) { return this.getTanks().find(t => t.id === id); },

  // ── Water Tests ───────────────────────────────────────
  getTests() { return JSON.parse(localStorage.getItem('aqualog_tests') || '[]'); },
  saveTests(t) { localStorage.setItem('aqualog_tests', JSON.stringify(t)); },
  addTest(test) {
    const tests = this.getTests();
    test.id = Date.now().toString();
    test.date = test.date || new Date().toISOString();
    tests.unshift(test);
    this.saveTests(tests);
    return test;
  },
  deleteTest(id) { this.saveTests(this.getTests().filter(t => t.id !== id)); },
  getTestsForTank(tankId) { return this.getTests().filter(t => t.tankId === tankId); },
  getLatestTest(tankId) { return this.getTestsForTank(tankId)[0] || null; },

  // ── Maintenance Logs ──────────────────────────────────
  getLogs() { return JSON.parse(localStorage.getItem('aqualog_logs') || '[]'); },
  saveLogs(l) { localStorage.setItem('aqualog_logs', JSON.stringify(l)); },
  addLog(log) {
    const logs = this.getLogs();
    log.id = Date.now().toString();
    log.date = log.date || new Date().toISOString();
    logs.unshift(log);
    this.saveLogs(logs);
    return log;
  },
  deleteLog(id) { this.saveLogs(this.getLogs().filter(l => l.id !== id)); },
  getLogsForTank(tankId) { return this.getLogs().filter(l => l.tankId === tankId); },

  // ── Livestock ─────────────────────────────────────────
  getLivestock() { return JSON.parse(localStorage.getItem('aqualog_livestock') || '[]'); },
  saveLivestock(l) { localStorage.setItem('aqualog_livestock', JSON.stringify(l)); },
  addLivestock(item) {
    const list = this.getLivestock();
    item.id = Date.now().toString();
    item.addedAt = new Date().toISOString();
    list.push(item);
    this.saveLivestock(list);
    return item;
  },
  deleteLivestock(id) { this.saveLivestock(this.getLivestock().filter(l => l.id !== id)); },
  getLivestockForTank(tankId) { return this.getLivestock().filter(l => l.tankId === tankId); },

  // Catalog scores are relative "stock units" per individual, not hard rules.
  // Bioload estimates waste pressure; size estimates adult swimming/space pressure.
  speciesCatalog: [
    ['neon-tetra','Neon Tetra','Paracheirodon innesi','Fish','Freshwater',1.5,10,1.1,1.2,'Easy','Peaceful','School',6,70,81,6.0,7.5,'Omnivore','Mid','nano,schooling,community','Classic peaceful schooler that does best in mature planted tanks.'],
    ['cardinal-tetra','Cardinal Tetra','Paracheirodon axelrodi','Fish','Freshwater',2.0,15,1.3,1.5,'Moderate','Peaceful','School',6,73,84,4.5,7.0,'Omnivore','Mid','schooling,community,soft-water','Bright schooler that prefers warm soft acidic water.'],
    ['green-neon-tetra','Green Neon Tetra','Paracheirodon simulans','Fish','Freshwater',1.0,10,0.8,0.9,'Moderate','Peaceful','School',8,75,84,4.5,7.0,'Omnivore','Mid','nano,schooling,soft-water','Tiny tetra for warm soft peaceful aquariums.'],
    ['ember-tetra','Ember Tetra','Hyphessobrycon amandae','Fish','Freshwater',0.9,10,0.7,0.8,'Easy','Peaceful','School',8,72,82,5.5,7.5,'Omnivore','Mid','nano,schooling,planted','Tiny orange schooling fish for calm planted tanks.'],
    ['glowlight-tetra','Glowlight Tetra','Hemigrammus erythrozonus','Fish','Freshwater',1.5,15,1.1,1.2,'Easy','Peaceful','School',6,74,82,5.5,7.5,'Omnivore','Mid','schooling,community','Hardy peaceful tetra with a slim orange stripe.'],
    ['black-neon-tetra','Black Neon Tetra','Hyphessobrycon herbertaxelrodi','Fish','Freshwater',1.5,15,1.2,1.3,'Easy','Peaceful','School',6,72,82,5.5,7.5,'Omnivore','Mid','schooling,community','Hardy midwater schooler for community tanks.'],
    ['rummy-nose-tetra','Rummy Nose Tetra','Hemigrammus rhodostomus','Fish','Freshwater',2.0,20,1.4,1.6,'Moderate','Peaceful','School',8,75,84,5.5,7.5,'Omnivore','Mid','schooling,indicator-fish','Tight schooling tetra; color fades when stressed.'],
    ['black-skirt-tetra','Black Skirt Tetra','Gymnocorymbus ternetzi','Fish','Freshwater',2.5,20,1.8,2.0,'Easy','Semi-aggressive','School',6,70,82,6.0,8.0,'Omnivore','Mid','schooling,community','Hardy tetra; can nip fins if kept in small groups.'],
    ['white-skirt-tetra','White Skirt Tetra','Gymnocorymbus ternetzi','Fish','Freshwater',2.5,20,1.8,2.0,'Easy','Semi-aggressive','School',6,70,82,6.0,8.0,'Omnivore','Mid','schooling,community','Color morph of black skirt tetra with similar care.'],
    ['serpae-tetra','Serpae Tetra','Hyphessobrycon eques','Fish','Freshwater',1.8,20,1.5,1.5,'Easy','Semi-aggressive','School',8,72,82,5.5,7.8,'Omnivore','Mid','schooling,fin-nipper','Active tetra that needs a larger group to reduce nipping.'],
    ['lemon-tetra','Lemon Tetra','Hyphessobrycon pulchripinnis','Fish','Freshwater',2.0,20,1.3,1.6,'Easy','Peaceful','School',6,72,82,5.5,8.0,'Omnivore','Mid','schooling,community','Peaceful yellow schooling tetra.'],
    ['emperor-tetra','Emperor Tetra','Nematobrycon palmeri','Fish','Freshwater',2.0,20,1.5,1.7,'Easy','Peaceful','Group',6,73,81,5.0,7.8,'Omnivore','Mid','community,planted','Attractive tetra that shows best in planted groups.'],
    ['congo-tetra','Congo Tetra','Phenacogrammus interruptus','Fish','Freshwater',3.5,40,3.0,3.5,'Moderate','Peaceful','School',6,74,82,6.0,7.8,'Omnivore','Mid','schooling,large-community','Larger active tetra that needs swimming room.'],
    ['bloodfin-tetra','Bloodfin Tetra','Aphyocharax anisitsi','Fish','Freshwater',2.0,20,1.4,1.6,'Easy','Peaceful','School',6,64,82,6.0,8.0,'Omnivore','Mid','schooling,hardy','Hardy cooler-water capable schooling tetra.'],
    ['x-ray-tetra','X-Ray Tetra','Pristella maxillaris','Fish','Freshwater',1.8,15,1.2,1.4,'Easy','Peaceful','School',6,72,82,6.0,8.0,'Omnivore','Mid','schooling,community','Adaptable transparent-bodied community tetra.'],
    ['harlequin-rasbora','Harlequin Rasbora','Trigonostigma heteromorpha','Fish','Freshwater',2.0,15,1.2,1.5,'Easy','Peaceful','School',6,72,81,6.0,7.8,'Omnivore','Mid','schooling,community','Reliable peaceful schooler for planted community tanks.'],
    ['lambchop-rasbora','Lambchop Rasbora','Trigonostigma espei','Fish','Freshwater',1.5,10,1.0,1.2,'Easy','Peaceful','School',8,73,82,5.5,7.5,'Omnivore','Mid','nano,schooling,planted','Smaller rasbora with tight schooling behavior.'],
    ['chili-rasbora','Chili Rasbora','Boraras brigittae','Fish','Freshwater',0.8,5,0.5,0.6,'Moderate','Peaceful','School',10,74,82,4.5,7.0,'Micro-predator','Mid','nano,schooling,soft-water','Tiny species for calm mature nano tanks.'],
    ['phoenix-rasbora','Phoenix Rasbora','Boraras merah','Fish','Freshwater',0.8,5,0.5,0.6,'Moderate','Peaceful','School',10,74,82,4.5,7.0,'Micro-predator','Mid','nano,schooling,soft-water','Micro rasbora for very peaceful tanks.'],
    ['celestial-pearl-danio','Celestial Pearl Danio','Danio margaritatus','Fish','Freshwater',1.0,10,0.8,0.9,'Moderate','Peaceful','Group',8,68,78,6.5,7.8,'Omnivore','Mid','nano,planted,cool-water','Small colorful danio that prefers cover and calm tankmates.'],
    ['zebra-danio','Zebra Danio','Danio rerio','Fish','Freshwater',2.0,20,1.4,1.8,'Easy','Peaceful','School',6,64,78,6.5,8.0,'Omnivore','Top','schooling,active,hardy','Fast active fish that needs length and a group.'],
    ['leopard-danio','Leopard Danio','Danio rerio var.','Fish','Freshwater',2.0,20,1.4,1.8,'Easy','Peaceful','School',6,64,78,6.5,8.0,'Omnivore','Top','schooling,active,hardy','Spotted zebra danio morph with the same active care needs.'],
    ['pearl-danio','Pearl Danio','Danio albolineatus','Fish','Freshwater',2.5,30,1.8,2.4,'Easy','Peaceful','School',6,68,78,6.5,7.8,'Omnivore','Top','schooling,active','Larger active danio for roomy community tanks.'],
    ['white-cloud-minnow','White Cloud Mountain Minnow','Tanichthys albonubes','Fish','Freshwater',1.5,10,1.0,1.1,'Easy','Peaceful','School',6,58,72,6.5,8.0,'Omnivore','Top','nano,cool-water,schooling','Cool-water schooler that should not be kept too warm long term.'],
    ['gold-white-cloud','Gold White Cloud Minnow','Tanichthys albonubes var.','Fish','Freshwater',1.5,10,1.0,1.1,'Easy','Peaceful','School',6,58,72,6.5,8.0,'Omnivore','Top','nano,cool-water,schooling','Gold color morph of the white cloud minnow.'],
    ['guppy','Guppy','Poecilia reticulata','Fish','Freshwater',2.0,10,1.6,1.5,'Easy','Peaceful','Group',3,72,82,6.8,8.2,'Omnivore','Top','livebearer,hard-water,community','Hardy livebearer; expect rapid breeding with mixed sexes.'],
    ['endler-livebearer','Endler Livebearer','Poecilia wingei','Fish','Freshwater',1.2,5,0.9,0.8,'Easy','Peaceful','Group',5,72,82,7.0,8.5,'Omnivore','Top','nano,livebearer,hard-water','Small active livebearer that breeds readily.'],
    ['platy','Platy','Xiphophorus maculatus','Fish','Freshwater',2.5,15,2.0,2.2,'Easy','Peaceful','Group',3,70,80,7.0,8.2,'Omnivore','Mid','livebearer,hard-water,community','Colorful hardy livebearer for alkaline community tanks.'],
    ['swordtail','Swordtail','Xiphophorus hellerii','Fish','Freshwater',4.0,30,3.2,4.0,'Easy','Peaceful','Group',4,70,82,7.0,8.3,'Omnivore','Mid','livebearer,active,hard-water','Active livebearer that needs more room than platies.'],
    ['molly','Molly','Poecilia sphenops','Fish','Freshwater',4.0,30,3.5,4.0,'Moderate','Peaceful','Group',4,74,82,7.2,8.5,'Omnivore','Mid','livebearer,hard-water,brackish-tolerant','Prefers hard alkaline water and very clean conditions.'],
    ['balloon-molly','Balloon Molly','Poecilia sphenops var.','Fish','Freshwater',3.0,30,3.2,3.0,'Moderate','Peaceful','Group',4,74,82,7.2,8.5,'Omnivore','Mid','livebearer,hard-water','Rounded molly morph with the same hard-water needs.'],
    ['betta','Betta','Betta splendens','Fish','Freshwater',2.5,5,2.0,2.0,'Easy','Semi-aggressive','Solo',1,76,82,6.5,7.8,'Carnivore','Top','centerpiece,nano,labyrinth','Males are usually kept singly; avoid fin nippers and other male bettas.'],
    ['female-betta','Female Betta','Betta splendens','Fish','Freshwater',2.3,10,1.8,1.8,'Moderate','Semi-aggressive','Solo',1,76,82,6.5,7.8,'Carnivore','Top','centerpiece,labyrinth','Can be calmer than males but still needs careful tankmate selection.'],
    ['honey-gourami','Honey Gourami','Trichogaster chuna','Fish','Freshwater',2.0,10,1.6,1.6,'Easy','Peaceful','Pair',1,74,82,6.0,7.8,'Omnivore','Top','centerpiece,community,planted','Gentle small gourami for calm community tanks.'],
    ['dwarf-gourami','Dwarf Gourami','Trichogaster lalius','Fish','Freshwater',3.0,20,2.6,2.8,'Moderate','Semi-aggressive','Solo',1,75,82,6.0,7.8,'Omnivore','Top','centerpiece,planted','Bright centerpiece fish; males can be territorial.'],
    ['sparkling-gourami','Sparkling Gourami','Trichopsis pumila','Fish','Freshwater',1.5,10,1.0,1.2,'Moderate','Peaceful','Group',3,76,82,6.0,7.5,'Micro-predator','Top','nano,labyrinth,planted','Tiny croaking gourami for quiet planted tanks.'],
    ['pearl-gourami','Pearl Gourami','Trichopodus leerii','Fish','Freshwater',4.5,30,3.4,4.2,'Easy','Peaceful','Pair',1,75,82,6.0,8.0,'Omnivore','Top','centerpiece,community','Peaceful larger gourami for roomy planted tanks.'],
    ['opaline-gourami','Opaline Gourami','Trichopodus trichopterus','Fish','Freshwater',6.0,40,4.8,6.0,'Easy','Semi-aggressive','Solo',1,74,82,6.0,8.2,'Omnivore','Top','centerpiece,territorial','Hardy but can become pushy in smaller tanks.'],
    ['angelfish','Freshwater Angelfish','Pterophyllum scalare','Fish','Freshwater',6.0,30,5.0,6.0,'Moderate','Semi-aggressive','Pair',1,76,84,6.0,7.8,'Omnivore','Mid','centerpiece,cichlid,tall-tank','Tall cichlid that may eat very small tankmates when grown.'],
    ['discus','Discus','Symphysodon aequifasciatus','Fish','Freshwater',8.0,75,6.5,8.0,'Expert','Peaceful','Group',5,82,88,5.5,7.0,'Omnivore','Mid','soft-water,warm,advanced','Sensitive warm-water cichlid that needs stable pristine conditions.'],
    ['german-blue-ram','German Blue Ram','Mikrogeophagus ramirezi','Fish','Freshwater',2.5,20,2.2,2.2,'Moderate','Peaceful','Pair',1,78,85,5.5,7.2,'Omnivore','Bottom','dwarf-cichlid,warm,soft-water','Colorful dwarf cichlid needing warm stable water.'],
    ['bolivian-ram','Bolivian Ram','Mikrogeophagus altispinosus','Fish','Freshwater',3.5,30,3.0,3.3,'Easy','Peaceful','Pair',1,74,80,6.0,7.8,'Omnivore','Bottom','dwarf-cichlid,community','Hardier dwarf cichlid for peaceful community tanks.'],
    ['apistogramma-cacatuoides','Cockatoo Apistogramma','Apistogramma cacatuoides','Fish','Freshwater',3.0,20,2.4,2.7,'Moderate','Semi-aggressive','Pair',1,75,82,6.0,7.8,'Carnivore','Bottom','dwarf-cichlid,cave-spawner','Territorial dwarf cichlid that appreciates caves and leaf litter.'],
    ['apistogramma-agassizii','Agassizii Apistogramma','Apistogramma agassizii','Fish','Freshwater',3.0,20,2.4,2.7,'Moderate','Semi-aggressive','Pair',1,75,82,5.0,7.2,'Carnivore','Bottom','dwarf-cichlid,soft-water','Soft-water dwarf cichlid with territorial breeding behavior.'],
    ['kribensis','Kribensis','Pelvicachromis pulcher','Fish','Freshwater',4.0,30,3.5,4.0,'Easy','Semi-aggressive','Pair',1,75,80,6.0,8.0,'Omnivore','Bottom','cichlid,cave-spawner','Hardy pair-bonding cichlid; protective when breeding.'],
    ['convict-cichlid','Convict Cichlid','Amatitlania nigrofasciata','Fish','Freshwater',6.0,40,6.5,6.5,'Easy','Aggressive','Pair',1,72,82,6.5,8.0,'Omnivore','All','cichlid,aggressive,breeder','Tough aggressive cichlid that breeds readily.'],
    ['electric-yellow-lab','Electric Yellow Lab','Labidochromis caeruleus','Fish','Freshwater',4.0,55,4.0,4.4,'Moderate','Semi-aggressive','Group',4,76,82,7.6,8.6,'Omnivore','Mid','african-cichlid,hard-water','Mbuna cichlid for hard alkaline African cichlid setups.'],
    ['demasoni-cichlid','Demasoni Cichlid','Pseudotropheus demasoni','Fish','Freshwater',3.0,55,3.5,3.5,'Expert','Aggressive','Group',12,76,82,7.8,8.6,'Herbivore','Rock','african-cichlid,aggressive','Small but highly aggressive mbuna that needs careful stocking.'],
    ['oscar','Oscar','Astronotus ocellatus','Fish','Freshwater',12.0,75,38.0,22.0,'Moderate','Aggressive','Solo',1,74,81,6.0,8.0,'Carnivore','All','large-fish,messy,cichlid','Large messy predator requiring strong filtration and space.'],
    ['jack-dempsey','Jack Dempsey','Rocio octofasciata','Fish','Freshwater',10.0,55,24.0,16.0,'Moderate','Aggressive','Solo',1,72,82,6.5,8.0,'Carnivore','All','large-fish,cichlid,aggressive','Robust territorial cichlid for large tanks.'],
    ['green-terror','Green Terror','Andinoacara rivulatus','Fish','Freshwater',10.0,75,26.0,17.0,'Moderate','Aggressive','Solo',1,70,80,6.5,8.0,'Carnivore','All','large-fish,cichlid,aggressive','Large assertive cichlid needing careful tankmates.'],
    ['firemouth-cichlid','Firemouth Cichlid','Thorichthys meeki','Fish','Freshwater',6.0,40,6.0,6.0,'Easy','Semi-aggressive','Pair',1,75,82,6.5,8.0,'Omnivore','Bottom','cichlid,semi-aggressive','Colorful Central American cichlid with moderate aggression.'],
    ['severum','Severum','Heros efasciatus','Fish','Freshwater',8.0,75,14.0,12.0,'Moderate','Semi-aggressive','Solo',1,74,82,6.0,7.8,'Omnivore','Mid','large-fish,cichlid','Large relatively mild cichlid that may eat plants.'],
    ['bronze-corydoras','Bronze Corydoras','Corydoras aeneus','Fish','Freshwater',2.8,20,1.8,2.4,'Easy','Peaceful','School',6,72,80,6.0,8.0,'Omnivore','Bottom','bottom-dweller,schooling,community','Hardy social bottom dweller; keep on smooth substrate.'],
    ['albino-corydoras','Albino Corydoras','Corydoras aeneus var.','Fish','Freshwater',2.8,20,1.8,2.4,'Easy','Peaceful','School',6,72,80,6.0,8.0,'Omnivore','Bottom','bottom-dweller,schooling,community','Albino bronze cory with identical care needs.'],
    ['panda-corydoras','Panda Corydoras','Corydoras panda','Fish','Freshwater',2.0,20,1.4,1.8,'Easy','Peaceful','School',6,70,78,6.0,7.6,'Omnivore','Bottom','bottom-dweller,schooling','Cooler-water cory that needs a group and soft substrate.'],
    ['pygmy-corydoras','Pygmy Corydoras','Corydoras pygmaeus','Fish','Freshwater',1.2,10,0.8,0.9,'Moderate','Peaceful','School',8,72,79,6.2,7.8,'Omnivore','Bottom','nano,bottom-dweller,schooling','Tiny cory that also schools in midwater.'],
    ['sterbai-corydoras','Sterbai Corydoras','Corydoras sterbai','Fish','Freshwater',2.6,30,1.8,2.3,'Easy','Peaceful','School',6,75,82,6.0,7.8,'Omnivore','Bottom','bottom-dweller,warm,schooling','Warmer-water cory often paired with discus-style tanks.'],
    ['julii-corydoras','Julii Corydoras','Corydoras julii','Fish','Freshwater',2.4,20,1.6,2.0,'Easy','Peaceful','School',6,72,79,6.0,7.8,'Omnivore','Bottom','bottom-dweller,schooling','Peaceful spotted cory for community groups.'],
    ['otocinclus','Otocinclus Catfish','Otocinclus macrospilus','Fish','Freshwater',1.7,10,0.9,1.2,'Moderate','Peaceful','Group',6,72,79,6.0,7.8,'Herbivore','Surface','algae-eater,nano,peaceful','Delicate algae grazer that needs mature tanks and steady food.'],
    ['bristlenose-pleco','Bristlenose Pleco','Ancistrus cirrhosus','Fish','Freshwater',5.0,25,7.0,5.5,'Easy','Peaceful','Solo',1,72,82,6.0,7.8,'Herbivore','Bottom','algae-eater,wood,pleco','Manageable pleco that still produces notable waste.'],
    ['clown-pleco','Clown Pleco','Panaqolus maccus','Fish','Freshwater',3.5,20,4.0,3.5,'Easy','Peaceful','Solo',1,73,82,6.0,7.8,'Wood grazer','Bottom','pleco,wood,community','Small wood-eating pleco; provide driftwood.'],
    ['rubber-lip-pleco','Rubber Lip Pleco','Chaetostoma milesi','Fish','Freshwater',5.5,30,6.5,5.5,'Moderate','Peaceful','Solo',1,70,78,6.5,7.8,'Herbivore','Bottom','pleco,algae-eater','Cooler fast-water pleco with high oxygen needs.'],
    ['common-pleco','Common Pleco','Pterygoplichthys pardalis','Fish','Freshwater',18.0,125,45.0,30.0,'Moderate','Peaceful','Solo',1,72,82,6.5,8.0,'Omnivore','Bottom','giant,pleco,messy','Grows very large and is not suitable for most home aquariums.'],
    ['kuhli-loach','Kuhli Loach','Pangio kuhlii','Fish','Freshwater',4.0,20,1.8,3.0,'Easy','Peaceful','Group',6,75,82,5.5,7.5,'Omnivore','Bottom','bottom-dweller,nocturnal,community','Peaceful eel-like loach that needs groups and hiding spots.'],
    ['hillstream-loach','Hillstream Loach','Sewellia lineolata','Fish','Freshwater',2.5,20,1.8,2.0,'Moderate','Peaceful','Group',3,66,75,6.5,8.0,'Biofilm grazer','Surface','algae-eater,high-flow,cool-water','Needs strong flow, oxygen, and mature biofilm.'],
    ['clown-loach','Clown Loach','Chromobotia macracanthus','Fish','Freshwater',12.0,125,18.0,22.0,'Moderate','Peaceful','Group',5,77,86,6.0,7.8,'Omnivore','Bottom','large-fish,schooling,loach','Social loach that gets very large over time.'],
    ['yoyo-loach','Yoyo Loach','Botia almorhae','Fish','Freshwater',6.0,55,7.0,7.0,'Moderate','Semi-aggressive','Group',5,75,82,6.5,7.8,'Omnivore','Bottom','loach,active,snail-eater','Active social loach that may harass slow fish.'],
    ['dwarf-chain-loach','Dwarf Chain Loach','Ambastaia sidthimunki','Fish','Freshwater',2.5,30,2.0,2.3,'Moderate','Peaceful','Group',6,76,82,6.0,7.8,'Omnivore','Bottom','loach,schooling,snail-eater','Smaller social loach for active communities.'],
    ['zebra-loach','Zebra Loach','Botia striata','Fish','Freshwater',4.0,40,4.5,4.5,'Moderate','Semi-aggressive','Group',5,73,79,6.0,7.8,'Omnivore','Bottom','loach,schooling','Striped active loach that needs a group.'],
    ['siamese-algae-eater','Siamese Algae Eater','Crossocheilus oblongus','Fish','Freshwater',6.0,30,4.0,5.5,'Easy','Peaceful','Group',1,72,79,6.0,8.0,'Omnivore','Bottom','algae-eater,active','Useful algae eater but active and larger than many expect.'],
    ['chinese-algae-eater','Chinese Algae Eater','Gyrinocheilus aymonieri','Fish','Freshwater',10.0,55,10.0,12.0,'Moderate','Aggressive','Solo',1,72,82,6.0,8.0,'Omnivore','Bottom','algae-eater,aggressive','Often becomes territorial and too large for community tanks.'],
    ['red-tail-shark','Red Tail Shark','Epalzeorhynchos bicolor','Fish','Freshwater',6.0,55,5.5,6.0,'Moderate','Semi-aggressive','Solo',1,72,79,6.5,7.8,'Omnivore','Bottom','territorial,active','Territorial bottom fish needing caves and tank length.'],
    ['rainbow-shark','Rainbow Shark','Epalzeorhynchos frenatum','Fish','Freshwater',6.0,55,5.5,6.0,'Moderate','Semi-aggressive','Solo',1,72,79,6.5,7.8,'Omnivore','Bottom','territorial,active','Similar to red tail shark with strong territorial behavior.'],
    ['roseline-shark','Roseline Shark','Sahyadria denisonii','Fish','Freshwater',6.0,75,5.0,7.0,'Moderate','Peaceful','School',6,60,77,6.5,7.8,'Omnivore','Mid','schooling,active,cool-water','Large active barb needing a long tank and group.'],
    ['bala-shark','Bala Shark','Balantiocheilos melanopterus','Fish','Freshwater',14.0,125,20.0,28.0,'Moderate','Peaceful','School',5,72,82,6.5,8.0,'Omnivore','Mid','large-fish,schooling,active','Grows large and needs a very large long aquarium.'],
    ['cherry-barb','Cherry Barb','Puntius titteya','Fish','Freshwater',2.0,15,1.3,1.5,'Easy','Peaceful','Group',6,72,80,6.0,8.0,'Omnivore','Mid','community,planted','Peaceful colorful barb for planted community tanks.'],
    ['tiger-barb','Tiger Barb','Puntigrus tetrazona','Fish','Freshwater',3.0,30,2.5,3.0,'Easy','Semi-aggressive','School',8,74,80,6.0,8.0,'Omnivore','Mid','schooling,fin-nipper,active','Keep in a large school to reduce fin nipping.'],
    ['gold-barb','Gold Barb','Barbodes semifasciolatus','Fish','Freshwater',3.0,30,2.4,3.0,'Easy','Peaceful','School',6,64,75,6.0,8.0,'Omnivore','Mid','schooling,hardy','Hardy active barb for cooler community tanks.'],
    ['odessa-barb','Odessa Barb','Pethia padamya','Fish','Freshwater',3.0,30,2.4,3.0,'Easy','Peaceful','School',6,68,78,6.0,7.8,'Omnivore','Mid','schooling,active','Colorful active barb for planted tanks.'],
    ['rosy-barb','Rosy Barb','Pethia conchonius','Fish','Freshwater',5.0,40,4.5,5.5,'Easy','Peaceful','School',6,64,78,6.0,8.0,'Omnivore','Mid','schooling,active,cool-water','Larger hardy barb that needs swimming space.'],
    ['boesemani-rainbowfish','Boesemani Rainbowfish','Melanotaenia boesemani','Fish','Freshwater',4.5,55,4.0,5.2,'Moderate','Peaceful','School',6,75,82,7.0,8.2,'Omnivore','Mid','schooling,active,hard-water','Active colorful rainbowfish for larger hard-water tanks.'],
    ['dwarf-neon-rainbowfish','Dwarf Neon Rainbowfish','Melanotaenia praecox','Fish','Freshwater',3.0,30,2.3,3.0,'Easy','Peaceful','School',6,74,82,6.5,8.0,'Omnivore','Mid','schooling,community','Smaller active rainbowfish for medium communities.'],
    ['threadfin-rainbowfish','Threadfin Rainbowfish','Iriatherina werneri','Fish','Freshwater',2.0,20,1.2,1.6,'Moderate','Peaceful','Group',6,74,82,6.0,7.8,'Micro-predator','Top','peaceful,planted,delicate','Delicate slow feeder needing calm tankmates.'],
    ['furcata-rainbowfish','Forktail Blue-eye','Pseudomugil furcatus','Fish','Freshwater',2.0,20,1.3,1.7,'Moderate','Peaceful','Group',6,75,82,7.0,8.0,'Omnivore','Top','schooling,planted','Active small rainbowfish relative for hard water.'],
    ['marbled-hatchetfish','Marbled Hatchetfish','Carnegiella strigata','Fish','Freshwater',1.5,20,1.0,1.3,'Moderate','Peaceful','School',6,74,82,5.5,7.5,'Carnivore','Top','jumper,schooling','Surface schooler; tight lid required.'],
    ['silver-dollar','Silver Dollar','Metynnis argenteus','Fish','Freshwater',6.0,75,7.5,8.5,'Moderate','Peaceful','School',5,75,82,6.0,7.8,'Herbivore','Mid','large-fish,schooling,plant-eater','Large schooling herbivore that eats many plants.'],
    ['beckfords-pencilfish','Beckfords Pencilfish','Nannostomus beckfordi','Fish','Freshwater',2.0,15,1.1,1.4,'Easy','Peaceful','Group',6,73,82,5.5,7.5,'Omnivore','Top','peaceful,planted','Slim peaceful upper-level community fish.'],
    ['golden-wonder-killifish','Golden Wonder Killifish','Aplocheilus lineatus','Fish','Freshwater',4.0,20,3.0,4.0,'Easy','Semi-aggressive','Solo',1,72,80,6.5,7.8,'Carnivore','Top','jumper,predator','Surface predator that may eat small tankmates.'],
    ['gardneri-killifish','Gardneri Killifish','Fundulopanchax gardneri','Fish','Freshwater',2.5,10,1.8,2.0,'Moderate','Semi-aggressive','Pair',1,70,76,6.0,7.5,'Carnivore','Top','colorful,jumper','Colorful killifish; keep covered and avoid tiny tankmates.'],
    ['pea-puffer','Pea Puffer','Carinotetraodon travancoricus','Fish','Freshwater',1.0,10,1.2,1.2,'Moderate','Semi-aggressive','Group',1,74,82,7.0,8.0,'Carnivore','All','nano,puffer,snail-eater','Tiny predator with territorial behavior and special diet needs.'],
    ['figure-eight-puffer','Figure Eight Puffer','Dichotomyctere ocellatus','Fish','Brackish',3.0,30,4.0,4.0,'Moderate','Semi-aggressive','Solo',1,74,82,7.5,8.4,'Carnivore','All','brackish,puffer,snail-eater','Best kept in low-end brackish water as it matures.'],
    ['bumblebee-goby','Bumblebee Goby','Brachygobius doriae','Fish','Brackish',1.5,10,0.8,1.1,'Moderate','Peaceful','Group',6,74,82,7.0,8.5,'Carnivore','Bottom','brackish,nano','Small goby often kept in species brackish setups.'],
    ['rope-fish','Rope Fish','Erpetoichthys calabaricus','Fish','Freshwater',18.0,55,10.0,15.0,'Moderate','Peaceful','Group',1,74,82,6.5,7.8,'Carnivore','Bottom','large-fish,escape-artist','Eel-like predator; secure every opening.'],
    ['senegal-bichir','Senegal Bichir','Polypterus senegalus','Fish','Freshwater',14.0,75,15.0,18.0,'Moderate','Predatory','Solo',1,75,82,6.2,7.8,'Carnivore','Bottom','large-fish,predator','Primitive predator that will eat small fish.'],
    ['silver-arowana','Silver Arowana','Osteoglossum bicirrhosum','Fish','Freshwater',36.0,250,70.0,80.0,'Expert','Predatory','Solo',1,75,82,6.0,7.5,'Carnivore','Top','giant,predator,jumper','Very large surface predator requiring massive covered aquariums.'],
    ['african-butterflyfish','African Butterflyfish','Pantodon buchholzi','Fish','Freshwater',5.0,40,4.0,5.0,'Moderate','Predatory','Solo',1,75,82,6.0,7.5,'Carnivore','Top','jumper,predator','Surface predator that needs floating cover and calm water.'],
    ['fancy-goldfish','Fancy Goldfish','Carassius auratus','Fish','Freshwater',8.0,30,18.0,10.0,'Easy','Peaceful','Group',2,62,74,7.0,8.4,'Omnivore','All','cold-water,messy','Messy cool-water fish needing strong filtration.'],
    ['common-goldfish','Common Goldfish','Carassius auratus','Fish','Freshwater',12.0,75,30.0,20.0,'Easy','Peaceful','Group',2,60,74,7.0,8.4,'Omnivore','All','cold-water,pond,messy','Fast large goldfish better suited to ponds or very large tanks.'],
    ['koi','Koi','Cyprinus rubrofuscus','Fish','Freshwater',24.0,250,80.0,90.0,'Moderate','Peaceful','Group',3,59,77,7.0,8.5,'Omnivore','All','pond,giant,messy','Pond fish, not practical for normal aquariums.'],
    ['cherry-shrimp','Cherry Shrimp','Neocaridina davidi','Shrimp','Freshwater',1.2,5,0.15,0.2,'Easy','Peaceful','Colony',10,65,78,6.5,8.0,'Omnivore','Surface','nano,clean-up,breeder','Hardy dwarf shrimp that breeds readily in planted tanks.'],
    ['blue-dream-shrimp','Blue Dream Shrimp','Neocaridina davidi var.','Shrimp','Freshwater',1.2,5,0.15,0.2,'Easy','Peaceful','Colony',10,65,78,6.5,8.0,'Omnivore','Surface','nano,clean-up,breeder','Blue neocaridina color strain with cherry shrimp care.'],
    ['snowball-shrimp','Snowball Shrimp','Neocaridina palmata','Shrimp','Freshwater',1.2,5,0.15,0.2,'Easy','Peaceful','Colony',10,65,78,6.5,8.0,'Omnivore','Surface','nano,clean-up,breeder','Peaceful dwarf shrimp for stable planted aquariums.'],
    ['amano-shrimp','Amano Shrimp','Caridina multidentata','Shrimp','Freshwater',2.0,10,0.3,0.5,'Easy','Peaceful','Group',3,68,80,6.5,7.8,'Omnivore','Surface','algae-eater,clean-up','Excellent algae eater; larvae need brackish water to survive.'],
    ['ghost-shrimp','Ghost Shrimp','Palaemonetes paludosus','Shrimp','Freshwater',1.5,5,0.2,0.3,'Easy','Peaceful','Group',5,65,80,6.8,8.0,'Omnivore','Surface','clean-up,nano','Low-bioload scavenger; quality varies by source.'],
    ['bamboo-shrimp','Bamboo Shrimp','Atyopsis moluccensis','Shrimp','Freshwater',3.5,20,0.8,1.2,'Moderate','Peaceful','Group',1,72,82,6.5,7.8,'Filter feeder','Flow','filter-feeder,high-flow','Needs suspended foods and moderate flow for filter feeding.'],
    ['vampire-shrimp','Vampire Shrimp','Atya gabonensis','Shrimp','Freshwater',5.0,30,1.2,2.0,'Moderate','Peaceful','Group',1,74,82,6.5,7.8,'Filter feeder','Flow','filter-feeder,large-shrimp','Large peaceful filter-feeding shrimp.'],
    ['crystal-red-shrimp','Crystal Red Shrimp','Caridina cantonensis','Shrimp','Freshwater',1.2,5,0.12,0.2,'Expert','Peaceful','Colony',10,68,74,5.8,6.8,'Omnivore','Surface','nano,soft-water,advanced','Sensitive soft-water dwarf shrimp for stable mature tanks.'],
    ['bee-shrimp','Bee Shrimp','Caridina cantonensis','Shrimp','Freshwater',1.2,5,0.12,0.2,'Expert','Peaceful','Colony',10,68,74,5.8,6.8,'Omnivore','Surface','nano,soft-water,advanced','Caridina shrimp that needs stable low-mineral water.'],
    ['tiger-shrimp','Tiger Shrimp','Caridina mariae','Shrimp','Freshwater',1.2,5,0.12,0.2,'Moderate','Peaceful','Colony',10,68,76,6.2,7.2,'Omnivore','Surface','nano,shrimp','Dwarf shrimp for stable planted aquariums.'],
    ['sulawesi-cardinal-shrimp','Sulawesi Cardinal Shrimp','Caridina dennerli','Shrimp','Freshwater',1.0,10,0.12,0.2,'Expert','Peaceful','Colony',10,78,84,7.8,8.5,'Biofilm grazer','Surface','sulawesi,advanced,warm','Specialist shrimp needing warm alkaline stable water.'],
    ['nerite-snail','Nerite Snail','Neritina natalensis','Snail','Freshwater',1.0,5,0.4,0.3,'Easy','Peaceful','Group',1,68,82,7.0,8.4,'Algae grazer','Surface','algae-eater,clean-up','Excellent algae grazer; eggs do not hatch in freshwater.'],
    ['horned-nerite-snail','Horned Nerite Snail','Clithon corona','Snail','Freshwater',0.8,5,0.3,0.2,'Easy','Peaceful','Group',1,68,82,7.0,8.4,'Algae grazer','Surface','algae-eater,nano','Small nerite suited to nano tanks.'],
    ['mystery-snail','Mystery Snail','Pomacea diffusa','Snail','Freshwater',2.0,10,1.0,0.8,'Easy','Peaceful','Group',1,68,82,7.0,8.4,'Omnivore','Surface','clean-up,hard-water','Large active snail that benefits from calcium-rich water.'],
    ['ramshorn-snail','Ramshorn Snail','Planorbidae sp.','Snail','Freshwater',0.8,3,0.2,0.2,'Easy','Peaceful','Colony',1,65,82,7.0,8.2,'Detritivore','Surface','clean-up,breeder,nano','Useful scavenger that can multiply with excess food.'],
    ['malaysian-trumpet-snail','Malaysian Trumpet Snail','Melanoides tuberculata','Snail','Freshwater',1.0,3,0.2,0.2,'Easy','Peaceful','Colony',1,65,82,7.0,8.2,'Detritivore','Substrate','clean-up,burrower,breeder','Burrowing snail that aerates substrate and breeds quickly.'],
    ['rabbit-snail','Rabbit Snail','Tylomelania sp.','Snail','Freshwater',3.0,20,0.8,1.2,'Moderate','Peaceful','Group',1,76,84,7.2,8.5,'Detritivore','Bottom','sulawesi,hard-water','Large slow snail preferring warm alkaline water.'],
    ['assassin-snail','Assassin Snail','Anentome helena','Snail','Freshwater',1.0,5,0.3,0.3,'Easy','Peaceful','Group',1,70,80,7.0,8.0,'Carnivore','Bottom','snail-eater,clean-up','Predatory snail often used to manage pest snails.'],
    ['bladder-snail','Bladder Snail','Physella acuta','Snail','Freshwater',0.5,2,0.1,0.1,'Easy','Peaceful','Colony',1,60,82,6.5,8.2,'Detritivore','Surface','clean-up,breeder,nano','Tiny hitchhiker snail that reproduces quickly.'],
    ['japanese-trapdoor-snail','Japanese Trapdoor Snail','Cipangopaludina japonica','Snail','Freshwater',2.0,10,0.8,0.8,'Easy','Peaceful','Group',1,60,78,7.0,8.2,'Detritivore','Bottom','cold-water,clean-up','Cool-water capable snail for ponds or aquariums.'],
    ['pagoda-snail','Pagoda Snail','Brotia pagodula','Snail','Freshwater',2.0,20,0.8,0.9,'Moderate','Peaceful','Group',1,72,80,7.0,8.2,'Biofilm grazer','Flow','high-flow,clean-up','Needs good oxygen and steady food.'],
    ['thai-micro-crab','Thai Micro Crab','Limnopilos naiyanetri','Crab','Freshwater',0.4,5,0.1,0.1,'Moderate','Peaceful','Group',5,72,82,6.5,7.8,'Micro-predator','Plants','nano,peaceful','Tiny shy crab for peaceful planted nano tanks.'],
    ['pom-pom-crab','Freshwater Pom Pom Crab','Ptychognathus barbatus','Crab','Freshwater',1.0,10,0.4,0.5,'Moderate','Peaceful','Group',1,72,80,7.0,8.0,'Omnivore','Bottom','nano,clean-up','Small peaceful crab that appreciates hiding places.'],
    ['mexican-dwarf-crayfish','Mexican Dwarf Crayfish','Cambarellus patzcuarensis','Crayfish','Freshwater',1.6,10,0.8,1.0,'Easy','Semi-aggressive','Group',1,65,78,7.0,8.2,'Omnivore','Bottom','nano,crayfish','Small crayfish that may still pinch slow fish or shrimp.'],
    ['blue-crayfish','Electric Blue Crayfish','Procambarus alleni','Crayfish','Freshwater',5.0,30,4.0,5.0,'Easy','Aggressive','Solo',1,65,78,7.0,8.2,'Omnivore','Bottom','crayfish,aggressive','Attractive but predatory; likely to catch fish and rearrange plants.'],
    ['ocellaris-clownfish','Ocellaris Clownfish','Amphiprion ocellaris','Fish','Saltwater',3.5,20,3.0,3.5,'Easy','Semi-aggressive','Pair',1,74,80,8.0,8.4,'Omnivore','Mid','reef,centerpiece','Hardy marine fish often kept as a pair.'],
    ['percula-clownfish','Percula Clownfish','Amphiprion percula','Fish','Saltwater',3.0,20,2.8,3.0,'Easy','Semi-aggressive','Pair',1,74,80,8.0,8.4,'Omnivore','Mid','reef,centerpiece','Classic clownfish similar to ocellaris.'],
    ['royal-gramma','Royal Gramma','Gramma loreto','Fish','Saltwater',3.0,30,2.5,3.0,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Carnivore','Caves','reef,community','Colorful cave-dweller that can be territorial near its shelter.'],
    ['firefish-goby','Firefish','Nemateleotris magnifica','Fish','Saltwater',3.0,20,2.0,2.8,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Carnivore','Mid','reef,jumper,peaceful','Peaceful dartfish; tight lid required.'],
    ['purple-firefish','Purple Firefish','Nemateleotris decora','Fish','Saltwater',3.5,30,2.4,3.2,'Moderate','Peaceful','Solo',1,74,80,8.0,8.4,'Carnivore','Mid','reef,jumper','Colorful dartfish that needs peaceful tankmates and a lid.'],
    ['green-chromis','Green Chromis','Chromis viridis','Fish','Saltwater',3.5,30,2.5,3.5,'Easy','Peaceful','Group',3,74,80,8.0,8.4,'Omnivore','Mid','reef,schooling','Active damselfish relative; groups may reduce over time.'],
    ['yellowtail-damselfish','Yellowtail Damselfish','Chrysiptera parasema','Fish','Saltwater',3.0,30,2.8,3.0,'Easy','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Omnivore','Rock','reef,hardy,territorial','Hardy but territorial small marine fish.'],
    ['azure-damselfish','Azure Damselfish','Chrysiptera hemicyanea','Fish','Saltwater',3.0,30,2.8,3.0,'Easy','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Omnivore','Rock','reef,hardy,territorial','Colorful hardy damselfish with moderate territoriality.'],
    ['yellow-watchman-goby','Yellow Watchman Goby','Cryptocentrus cinctus','Fish','Saltwater',4.0,30,2.8,3.8,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Carnivore','Bottom','reef,goby,pistol-pair','Bottom goby that may pair with pistol shrimp.'],
    ['diamond-goby','Diamond Watchman Goby','Valenciennea puellaris','Fish','Saltwater',6.0,50,4.0,6.0,'Moderate','Peaceful','Solo',1,74,80,8.0,8.4,'Sand sifter','Bottom','reef,sand-sifter','Needs mature sand bed and may scatter sand.'],
    ['neon-goby','Neon Goby','Elacatinus oceanops','Fish','Saltwater',2.0,10,1.2,1.5,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Carnivore','Rock','reef,nano,cleaner','Tiny hardy goby for nano reef tanks.'],
    ['green-clown-goby','Green Clown Goby','Gobiodon histrio','Fish','Saltwater',1.5,10,1.0,1.2,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Carnivore','Coral','reef,nano,goby','Small perching goby; may irritate SPS corals.'],
    ['tailspot-blenny','Tailspot Blenny','Ecsenius stigmatura','Fish','Saltwater',2.5,10,1.8,2.0,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Herbivore','Rock','reef,nano,algae-grazer','Personable small blenny that grazes algae film.'],
    ['bicolor-blenny','Bicolor Blenny','Ecsenius bicolor','Fish','Saltwater',4.0,30,3.0,4.0,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Herbivore','Rock','reef,algae-grazer','Rock-perching herbivore with personality.'],
    ['lawnmower-blenny','Lawnmower Blenny','Salarias fasciatus','Fish','Saltwater',5.0,40,4.0,5.0,'Moderate','Peaceful','Solo',1,74,80,8.0,8.4,'Herbivore','Rock','reef,algae-grazer','Needs mature algae growth or supplemental herbivore foods.'],
    ['banggai-cardinalfish','Banggai Cardinalfish','Pterapogon kauderni','Fish','Saltwater',3.0,30,2.4,3.0,'Easy','Peaceful','Pair',1,74,80,8.0,8.4,'Carnivore','Mid','reef,peaceful','Slow peaceful cardinalfish; captive-bred preferred.'],
    ['pajama-cardinalfish','Pajama Cardinalfish','Sphaeramia nematoptera','Fish','Saltwater',3.5,30,2.6,3.4,'Easy','Peaceful','Group',3,74,80,8.0,8.4,'Carnivore','Mid','reef,peaceful','Hardy peaceful nocturnal cardinalfish.'],
    ['six-line-wrasse','Six Line Wrasse','Pseudocheilinus hexataenia','Fish','Saltwater',3.0,30,2.8,3.0,'Moderate','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Carnivore','Rock','reef,pest-control,territorial','Active wrasse that can become aggressive.'],
    ['melanurus-wrasse','Melanurus Wrasse','Halichoeres melanurus','Fish','Saltwater',5.0,50,4.0,5.0,'Moderate','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Carnivore','All','reef,pest-control,jumper','Useful pest hunter; needs sand and a tight lid.'],
    ['cleaner-wrasse','Cleaner Wrasse','Labroides dimidiatus','Fish','Saltwater',4.0,75,3.0,4.0,'Expert','Peaceful','Solo',1,74,80,8.0,8.4,'Carnivore','All','reef,advanced','Specialized feeder with poor survival in many aquariums.'],
    ['mandarin-dragonet','Mandarin Dragonet','Synchiropus splendidus','Fish','Saltwater',3.0,30,2.0,2.5,'Expert','Peaceful','Solo',1,74,80,8.0,8.4,'Microfauna','Rock','reef,copepods,advanced','Needs a mature pod population or trained feeding.'],
    ['flame-angelfish','Flame Angelfish','Centropyge loricula','Fish','Saltwater',4.0,55,4.5,4.5,'Moderate','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Omnivore','Rock','reef-caution,dwarf-angel','Dwarf angelfish; may nip some corals.'],
    ['coral-beauty-angelfish','Coral Beauty Angelfish','Centropyge bispinosa','Fish','Saltwater',4.0,55,4.0,4.5,'Moderate','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Omnivore','Rock','reef-caution,dwarf-angel','Hardy dwarf angel with possible coral nipping.'],
    ['yellow-tang','Yellow Tang','Zebrasoma flavescens','Fish','Saltwater',8.0,90,9.0,12.0,'Moderate','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Herbivore','All','reef,tang,algae-grazer','Active herbivore needing a long established aquarium.'],
    ['blue-tang','Blue Tang','Paracanthurus hepatus','Fish','Saltwater',12.0,180,15.0,22.0,'Moderate','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Omnivore','All','reef,tang,large-fish','Large active tang needing significant swimming space.'],
    ['kole-tang','Kole Tang','Ctenochaetus strigosus','Fish','Saltwater',7.0,70,7.5,10.0,'Moderate','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Detritivore','Rock','reef,tang,algae-grazer','Bristletooth tang that grazes film algae and detritus.'],
    ['tomini-tang','Tomini Tang','Ctenochaetus tominiensis','Fish','Saltwater',6.0,70,6.5,8.5,'Moderate','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Detritivore','Rock','reef,tang,algae-grazer','Smaller bristletooth tang for larger reef tanks.'],
    ['foxface-rabbitfish','Foxface Rabbitfish','Siganus vulpinus','Fish','Saltwater',9.0,90,10.0,13.0,'Moderate','Peaceful','Solo',1,74,80,8.0,8.4,'Herbivore','All','reef-caution,venomous,algae-grazer','Useful algae grazer with venomous dorsal spines.'],
    ['flame-hawkfish','Flame Hawkfish','Neocirrhites armatus','Fish','Saltwater',4.0,30,3.5,4.0,'Easy','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Carnivore','Rock','reef-caution,percher','May eat small shrimp.'],
    ['longnose-hawkfish','Longnose Hawkfish','Oxycirrhites typus','Fish','Saltwater',5.0,30,3.8,5.0,'Moderate','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Carnivore','Rock','reef-caution,percher','Perching predator that may eat ornamental shrimp.'],
    ['chalk-bass','Chalk Bass','Serranus tortugarum','Fish','Saltwater',3.0,30,2.5,3.0,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Carnivore','Rock','reef,hardy','Hardy small basslet for reef communities.'],
    ['orchid-dottyback','Orchid Dottyback','Pseudochromis fridmani','Fish','Saltwater',3.0,30,2.5,3.0,'Easy','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Carnivore','Rock','reef,territorial','Captive-bred individuals are usually more manageable.'],
    ['copperband-butterflyfish','Copperband Butterflyfish','Chelmon rostratus','Fish','Saltwater',8.0,75,7.0,10.0,'Expert','Peaceful','Solo',1,74,80,8.0,8.4,'Carnivore','Rock','reef-caution,advanced','Difficult feeder often bought for aiptasia control.'],
    ['aiptasia-eating-filefish','Aiptasia Eating Filefish','Acreichthys tomentosus','Fish','Saltwater',4.0,30,3.0,4.0,'Moderate','Peaceful','Solo',1,74,80,8.0,8.4,'Omnivore','Rock','reef-caution,pest-control','May eat aiptasia but can nip corals.'],
    ['snowflake-eel','Snowflake Moray Eel','Echidna nebulosa','Fish','Saltwater',24.0,75,18.0,22.0,'Moderate','Predatory','Solo',1,74,80,8.0,8.4,'Carnivore','Caves','predator,escape-artist','Predatory eel; secure lid and avoid small fish or shrimp.'],
    ['dwarf-lionfish','Dwarf Lionfish','Dendrochirus brachypterus','Fish','Saltwater',7.0,55,8.0,8.5,'Moderate','Predatory','Solo',1,74,80,8.0,8.4,'Carnivore','Rock','predator,venomous','Venomous ambush predator that eats small tankmates.'],
    ['skunk-cleaner-shrimp','Skunk Cleaner Shrimp','Lysmata amboinensis','Shrimp','Saltwater',2.5,20,0.8,1.0,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Omnivore','Rock','reef,cleaner','Iconic cleaner shrimp for peaceful reef tanks.'],
    ['fire-shrimp','Fire Shrimp','Lysmata debelius','Shrimp','Saltwater',2.0,20,0.8,1.0,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Omnivore','Rock','reef,cleaner','Colorful shy cleaner shrimp.'],
    ['peppermint-shrimp','Peppermint Shrimp','Lysmata wurdemanni','Shrimp','Saltwater',2.0,10,0.5,0.7,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Omnivore','Rock','reef,pest-control','Sometimes eats aiptasia; species ID matters.'],
    ['pistol-shrimp','Pistol Shrimp','Alpheus randalli','Shrimp','Saltwater',2.0,20,0.5,0.8,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Omnivore','Burrow','reef,goby-pair','Burrowing shrimp that may pair with watchman gobies.'],
    ['coral-banded-shrimp','Coral Banded Shrimp','Stenopus hispidus','Shrimp','Saltwater',3.0,30,0.9,1.2,'Easy','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Carnivore','Rock','reef-caution,territorial','Can harass small fish and shrimp.'],
    ['emerald-crab','Emerald Crab','Mithraculus sculptus','Crab','Saltwater',2.0,20,0.7,1.0,'Easy','Semi-aggressive','Solo',1,74,80,8.0,8.4,'Omnivore','Rock','reef-caution,algae-eater','Often grazes bubble algae but may bother corals when hungry.'],
    ['blue-leg-hermit-crab','Blue Leg Hermit Crab','Clibanarius tricolor','Crab','Saltwater',1.0,5,0.2,0.3,'Easy','Semi-aggressive','Group',1,74,80,8.0,8.4,'Omnivore','Rock','clean-up,reef','Useful scavenger; provide spare shells.'],
    ['scarlet-hermit-crab','Scarlet Hermit Crab','Paguristes cadenati','Crab','Saltwater',1.5,10,0.3,0.4,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Omnivore','Rock','clean-up,reef','Usually calmer than many hermits.'],
    ['turbo-snail','Turbo Snail','Turbo fluctuosa','Snail','Saltwater',2.0,20,0.5,0.8,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Algae grazer','Surface','clean-up,algae-eater','Strong algae grazer that can knock loose frags.'],
    ['trochus-snail','Trochus Snail','Trochus sp.','Snail','Saltwater',1.5,10,0.4,0.6,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Algae grazer','Surface','clean-up,algae-eater','Reliable reef-safe grazer that can right itself.'],
    ['nassarius-snail','Nassarius Snail','Nassarius vibex','Snail','Saltwater',0.8,10,0.2,0.3,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Scavenger','Sand','clean-up,sand-bed','Sand-bed scavenger, not an algae eater.'],
    ['cerith-snail','Cerith Snail','Cerithium sp.','Snail','Saltwater',1.0,5,0.2,0.3,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Algae grazer','Sand','clean-up,algae-eater','Small grazer that works glass, rock, and sand.'],
    ['astraea-snail','Astraea Snail','Astraea tecta','Snail','Saltwater',1.0,10,0.3,0.4,'Easy','Peaceful','Group',1,74,80,8.0,8.4,'Algae grazer','Surface','clean-up,algae-eater','Good grazer but may not right itself if flipped.'],
    ['tiger-conch','Tiger Conch','Conomurex luhuanus','Snail','Saltwater',4.0,50,0.9,2.0,'Moderate','Peaceful','Solo',1,74,80,8.0,8.4,'Detritivore','Sand','sand-bed,clean-up','Needs a mature sand bed with enough food.'],
    ['tuxedo-urchin','Tuxedo Urchin','Mespilia globulus','Invertebrate','Saltwater',3.0,30,0.8,1.5,'Moderate','Peaceful','Solo',1,74,80,8.0,8.4,'Algae grazer','Rock','reef,algae-eater','Excellent grazer that may carry loose frags.'],
    ['pincushion-urchin','Pincushion Urchin','Lytechinus variegatus','Invertebrate','Saltwater',4.0,40,1.0,2.0,'Moderate','Peaceful','Solo',1,74,80,8.0,8.4,'Algae grazer','Rock','reef,algae-eater','Strong algae grazer; secure frags and rockwork.'],
    ['brittle-star','Brittle Star','Ophiuroidea sp.','Invertebrate','Saltwater',8.0,30,1.0,2.0,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Scavenger','Rock','clean-up,reef','Nocturnal scavenger; avoid large green predatory types with small fish.'],
    ['feather-duster-worm','Feather Duster Worm','Sabellastarte sp.','Invertebrate','Saltwater',4.0,20,0.2,0.8,'Moderate','Peaceful','Group',1,74,80,8.0,8.4,'Filter feeder','Rock','reef,filter-feeder','Needs planktonic foods and stable reef water.'],
    ['zoanthids','Zoanthids','Zoanthus sp.','Coral','Saltwater',1.0,10,0.0,0.5,'Easy','Peaceful','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,soft-coral,beginner','Hardy colonial coral; handle with eye and skin protection.'],
    ['mushroom-coral','Mushroom Coral','Discosoma sp.','Coral','Saltwater',2.0,10,0.0,0.7,'Easy','Peaceful','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,soft-coral,beginner','Very forgiving low-flow soft coral.'],
    ['green-star-polyp','Green Star Polyp','Pachyclavularia violacea','Coral','Saltwater',2.0,10,0.0,1.0,'Easy','Peaceful','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,soft-coral,fast-grower','Fast-growing mat coral; isolate if you do not want it spreading.'],
    ['xenia','Pulsing Xenia','Xenia sp.','Coral','Saltwater',3.0,10,0.0,1.0,'Easy','Peaceful','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,soft-coral,fast-grower','Fast grower that may spread aggressively.'],
    ['toadstool-leather','Toadstool Leather Coral','Sarcophyton sp.','Coral','Saltwater',8.0,30,0.0,3.0,'Easy','Peaceful','Solo',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,soft-coral','Hardy leather coral that can grow large.'],
    ['duncan-coral','Duncan Coral','Duncanopsammia axifuga','Coral','Saltwater',4.0,20,0.0,1.5,'Easy','Peaceful','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,lps,beginner','Beginner-friendly LPS coral that accepts feeding.'],
    ['hammer-coral','Hammer Coral','Euphyllia ancora','Coral','Saltwater',6.0,30,0.0,2.5,'Moderate','Semi-aggressive','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,lps,sweeper','Needs space for sweeper tentacles.'],
    ['frogspawn-coral','Frogspawn Coral','Euphyllia divisa','Coral','Saltwater',6.0,30,0.0,2.5,'Moderate','Semi-aggressive','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,lps,sweeper','Moderate-flow LPS with stinging reach.'],
    ['torch-coral','Torch Coral','Euphyllia glabrescens','Coral','Saltwater',8.0,40,0.0,3.0,'Moderate','Aggressive','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,lps,sweeper','Long stinging tentacles; give generous spacing.'],
    ['acan-coral','Acan Coral','Micromussa lordhowensis','Coral','Saltwater',4.0,20,0.0,1.5,'Moderate','Semi-aggressive','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,lps','Colorful fleshy LPS that benefits from feeding.'],
    ['candy-cane-coral','Candy Cane Coral','Caulastrea furcata','Coral','Saltwater',4.0,20,0.0,1.5,'Easy','Semi-aggressive','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,lps,beginner','Hardy branching LPS with moderate light needs.'],
    ['birdsnest-coral','Birdsnest Coral','Seriatopora hystrix','Coral','Saltwater',6.0,30,0.0,2.0,'Moderate','Peaceful','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,sps','Branching SPS needing stable alkalinity and flow.'],
    ['montipora-cap','Montipora Cap','Montipora capricornis','Coral','Saltwater',8.0,30,0.0,2.5,'Moderate','Peaceful','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,sps','Plating SPS coral that can shade neighbors.'],
    ['acropora','Acropora','Acropora sp.','Coral','Saltwater',8.0,50,0.0,3.0,'Expert','Peaceful','Colony',1,74,80,8.0,8.4,'Photosynthetic','Rock','reef,sps,advanced','Demanding SPS needing strong light, flow, and stable chemistry.'],
    ['java-fern','Java Fern','Microsorum pteropus','Plant','Freshwater',12.0,5,0.0,0.0,'Easy','Peaceful','Group',1,68,82,6.0,8.0,'Photosynthetic','Attached','plant,low-light,beginner','Attach rhizome to hardscape; do not bury it.'],
    ['anubias-nana','Anubias Nana','Anubias barteri var. nana','Plant','Freshwater',6.0,5,0.0,0.0,'Easy','Peaceful','Group',1,68,82,6.0,8.0,'Photosynthetic','Attached','plant,low-light,beginner','Slow-growing epiphyte with tough leaves.'],
    ['amazon-sword','Amazon Sword','Echinodorus grisebachii','Plant','Freshwater',20.0,20,0.0,0.0,'Easy','Peaceful','Solo',1,68,82,6.5,7.8,'Photosynthetic','Rooted','plant,root-feeder','Large root-feeding plant for medium or large tanks.'],
    ['java-moss','Java Moss','Taxiphyllum barbieri','Plant','Freshwater',4.0,3,0.0,0.0,'Easy','Peaceful','Group',1,60,82,5.5,8.0,'Photosynthetic','Attached','plant,moss,shrimp','Hardy moss often used for shrimp and fry cover.'],
    ['hornwort','Hornwort','Ceratophyllum demersum','Plant','Freshwater',24.0,10,0.0,0.0,'Easy','Peaceful','Group',1,60,82,6.0,8.0,'Photosynthetic','Floating','plant,fast-grower','Fast nutrient sponge that can float or be weighted.'],
    ['water-wisteria','Water Wisteria','Hygrophila difformis','Plant','Freshwater',20.0,10,0.0,0.0,'Easy','Peaceful','Group',1,70,82,6.5,7.8,'Photosynthetic','Rooted','plant,fast-grower','Fast-growing stem plant for nutrient uptake.'],
    ['dwarf-hairgrass','Dwarf Hairgrass','Eleocharis parvula','Plant','Freshwater',4.0,5,0.0,0.0,'Moderate','Peaceful','Group',1,68,82,6.5,7.8,'Photosynthetic','Rooted','plant,carpet','Carpeting plant that benefits from strong light and CO2.'],
    ['vallisneria','Vallisneria','Vallisneria sp.','Plant','Freshwater',24.0,15,0.0,0.0,'Easy','Peaceful','Group',1,64,82,6.5,8.2,'Photosynthetic','Rooted','plant,background','Tall grass-like background plant that spreads by runners.']
  ].map(([id, commonName, scientificName, category, environment, adultSizeIn, minTankGal, bioloadScore, sizeScore, difficulty, temperament, social, minGroup, tempMin, tempMax, phMin, phMax, diet, zone, tags, notes]) => ({
    id, commonName, scientificName, category, environment, adultSizeIn, minTankGal,
    bioloadScore, sizeScore, difficulty, temperament, social, minGroup,
    tempMin, tempMax, phMin, phMax, diet, zone, notes,
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
  })),
  getSpeciesCatalog() { return this.speciesCatalog; },
  getSpeciesById(id) { return this.speciesCatalog.find(s => s.id === id) || null; },
  getTankVolumeGallons(tank) {
    if (!tank) return 0;
    const volume = parseFloat(tank.volume);
    if (!isFinite(volume) || volume <= 0) return 0;
    return tank.volumeUnit === 'L' ? volume * 0.264172 : volume;
  },
  getTankEnvironment(tank) {
    const type = (tank?.type || '').toLowerCase();
    if (type.includes('salt')) return 'Saltwater';
    if (type.includes('brackish')) return 'Brackish';
    return 'Freshwater';
  },
  getLivestockMetrics(item) {
    const species = item.speciesId ? this.getSpeciesById(item.speciesId) : null;
    const qty = Math.max(1, parseInt(item.qty, 10) || 1);
    const adultSizeIn = parseFloat(item.adultSizeIn ?? species?.adultSizeIn) || 0;
    const bioloadScore = parseFloat(item.bioloadScore ?? species?.bioloadScore);
    const sizeScore = parseFloat(item.sizeScore ?? species?.sizeScore);
    return {
      qty,
      species,
      adultSizeIn,
      bioloadScore: isFinite(bioloadScore) ? bioloadScore : Math.max(0.5, adultSizeIn || 1),
      sizeScore: isFinite(sizeScore) ? sizeScore : Math.max(0.5, adultSizeIn || 1),
    };
  },
  getStockingSummary(tankId, extraItems = []) {
    const tank = this.getTank(tankId);
    const gallons = this.getTankVolumeGallons(tank);
    const environment = this.getTankEnvironment(tank);
    const factor = environment === 'Saltwater' ? 0.65 : environment === 'Brackish' ? 0.8 : 1;
    const bioloadCapacity = Math.max(1, gallons * factor);
    const sizeCapacity = Math.max(1, gallons * (environment === 'Saltwater' ? 0.75 : 0.9));
    const items = [...this.getLivestockForTank(tankId), ...extraItems];
    const totals = items.reduce((acc, item) => {
      const metrics = this.getLivestockMetrics(item);
      acc.count += metrics.qty;
      acc.bioload += metrics.bioloadScore * metrics.qty;
      acc.size += metrics.sizeScore * metrics.qty;
      return acc;
    }, { count: 0, bioload: 0, size: 0 });
    const bioloadPercent = Math.round((totals.bioload / bioloadCapacity) * 100);
    const sizePercent = Math.round((totals.size / sizeCapacity) * 100);
    const percent = Math.max(bioloadPercent, sizePercent);
    return {
      tank, gallons, environment,
      bioload: totals.bioload,
      size: totals.size,
      count: totals.count,
      bioloadCapacity,
      sizeCapacity,
      bioloadPercent,
      sizePercent,
      percent,
      status: this.getStockingStatus(percent)
    };
  },
  getStockingStatus(percent) {
    if (percent >= 110) return { key: 'danger', label: 'Overstocked', badge: 'badge-danger' };
    if (percent >= 90) return { key: 'warn', label: 'Near Limit', badge: 'badge-warn' };
    if (percent >= 70) return { key: 'watch', label: 'Watch', badge: 'badge-warn' };
    return { key: 'ok', label: 'Healthy', badge: 'badge-ok' };
  },
  getSpeciesWarnings(tankId, species, qty = 1) {
    const tank = this.getTank(tankId);
    if (!tank || !species) return [];
    const warnings = [];
    const gallons = this.getTankVolumeGallons(tank);
    const tankEnv = this.getTankEnvironment(tank);
    const parsedQty = parseInt(qty, 10);
    const addQty = Number.isFinite(parsedQty) ? Math.max(0, parsedQty) : 1;
    const compatibleEnv = species.environment === tankEnv || (species.environment === 'Freshwater' && tankEnv === 'Brackish');
    if (!compatibleEnv) warnings.push(`${species.environment} species selected for a ${tankEnv.toLowerCase()} tank.`);
    if (gallons && species.minTankGal && gallons < species.minTankGal) warnings.push(`Minimum tank size is ${species.minTankGal} gal; this tank is ${Math.round(gallons * 10) / 10} gal.`);

    const sameSpeciesQty = this.getLivestockForTank(tankId)
      .filter(item => item.speciesId === species.id || item.name === species.commonName)
      .reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);
    const projectedQty = sameSpeciesQty + addQty;
    if (species.minGroup > 1 && projectedQty < species.minGroup) warnings.push(`Social species: plan for at least ${species.minGroup}; projected group is ${projectedQty}.`);

    const latest = this.getLatestTest(tankId);
    if (latest) {
      const temp = parseFloat(latest.temp);
      const ph = parseFloat(latest.ph);
      if (isFinite(temp) && (temp < species.tempMin || temp > species.tempMax)) warnings.push(`Current temp ${temp} is outside ${species.tempMin}-${species.tempMax}.`);
      if (isFinite(ph) && (ph < species.phMin || ph > species.phMax)) warnings.push(`Current pH ${ph} is outside ${species.phMin}-${species.phMax}.`);
    }

    if (addQty > 0) {
      const projected = this.getStockingSummary(tankId, [{
        qty: addQty,
        speciesId: species.id,
        bioloadScore: species.bioloadScore,
        sizeScore: species.sizeScore,
        adultSizeIn: species.adultSizeIn
      }]);
      if (projected.percent >= 110) warnings.push(`Projected stocking would reach ${projected.percent}% (${projected.status.label}).`);
    }
    return warnings;
  },

  // ── Reminders ─────────────────────────────────────────
  getReminders() { return JSON.parse(localStorage.getItem('aqualog_reminders') || '[]'); },
  saveReminders(r) { localStorage.setItem('aqualog_reminders', JSON.stringify(r)); },
  addReminder(reminder) {
    const reminders = this.getReminders();
    reminder.id = Date.now().toString();
    reminders.push(reminder);
    this.saveReminders(reminders);
    return reminder;
  },
  deleteReminder(id) { this.saveReminders(this.getReminders().filter(r => r.id !== id)); },
  getDueReminders() {
    const now = new Date();
    return this.getReminders().filter(r => !r.done && new Date(r.dueDate) <= now);
  },

  // ── Helpers ───────────────────────────────────────────
  formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },
  formatDateTime(iso) {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  },
  timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  },
  // Parameter status helpers
  getParamStatus(param, value) {
    const ranges = {
      ph:       { low: [0, 6.4], ok: [6.4, 7.6], warn: [7.6, 8.5], high: [8.5, 14] },
      temp:     { low: [0, 72],  ok: [72, 82],    warn: [82, 86],   high: [86, 200] },
      ammonia:  { ok: [0, 0.25], warn: [0.25, 1], high: [1, 999] },
      nitrite:  { ok: [0, 0.25], warn: [0.25, 0.5], high: [0.5, 999] },
      nitrate:  { ok: [0, 20],   warn: [20, 40],  high: [40, 999] },
      gh:       { low: [0, 4],   ok: [4, 12],     warn: [12, 20],  high: [20, 999] },
      kh:       { low: [0, 3],   ok: [3, 8],      warn: [8, 12],   high: [12, 999] },
    };
    const r = ranges[param];
    if (!r) return 'ok';
    const v = parseFloat(value);
    if (isNaN(v)) return 'unknown';
    if (v >= (r.high || [999])[0]) return 'danger';
    if (v >= (r.warn || [999])[0]) return 'warn';
    if (r.low && v < r.low[1]) return 'low';
    return 'ok';
  },
  exportData() {
    const data = {
      tanks: this.getTanks(),
      tests: this.getTests(),
      logs: this.getLogs(),
      livestock: this.getLivestock(),
      reminders: this.getReminders(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `aqualog-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  },
  importData(json) {
    try {
      const data = JSON.parse(json);
      if (data.tanks) this.saveTanks(data.tanks);
      if (data.tests) this.saveTests(data.tests);
      if (data.logs) this.saveLogs(data.logs);
      if (data.livestock) this.saveLivestock(data.livestock);
      if (data.reminders) this.saveReminders(data.reminders);
      return true;
    } catch { return false; }
  }
};
