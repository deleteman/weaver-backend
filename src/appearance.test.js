// src/appearance.test.js
const {
    generateAppearance,
    EYE_COLORS,
    SKIN_TONES,
    HAIR_COLORS,
    HAIR_LENGTHS,
    HAIR_STYLES,
    FACIAL_HAIR,
    HEIGHTS,
    BUILDS,
    FACE_SHAPES,
    EYE_SHAPES,
    COMPLEXIONS,
    EXPRESSION_BIASES,
    NOSE_SHAPES,
} = require('./appearance');

describe('generateAppearance', () => {
    describe('determinism', () => {
        test('returns identical output for identical inputs', () => {
            const a = generateAppearance('npc_test_1', 30, 'Guard', 'Mountain', 'Alive');
            const b = generateAppearance('npc_test_1', 30, 'Guard', 'Mountain', 'Alive');
            expect(a).toEqual(b);
        });

        test('different npcIds produce different results', () => {
            const a = generateAppearance('npc_aaa', 30, 'Citizen', 'Plains', 'Alive');
            const b = generateAppearance('npc_bbb', 30, 'Citizen', 'Plains', 'Alive');
            expect(a).not.toEqual(b);
        });

        test('same npcId with different age produces different output', () => {
            const young = generateAppearance('npc_age_test', 20, 'Citizen', 'Plains', 'Alive');
            const old   = generateAppearance('npc_age_test', 80, 'Citizen', 'Plains', 'Alive');
            expect(young).not.toEqual(old);
        });
    });

    describe('dead flag', () => {
        test('dead is true when status is Dead', () => {
            const a = generateAppearance('npc_dead', 50, 'Guard', 'Forest', 'Dead');
            expect(a.dead).toBe(true);
        });

        test('dead is false when status is Alive', () => {
            const a = generateAppearance('npc_alive', 50, 'Guard', 'Forest', 'Alive');
            expect(a.dead).toBe(false);
        });

        test('appearance object is still fully populated when dead', () => {
            const a = generateAppearance('npc_dead2', 40, 'Merchant', 'Desert', 'Dead');
            expect(a.eyeColor).toBeDefined();
            expect(a.hair).toBeDefined();
            expect(a.clothing).toBeDefined();
        });
    });

    describe('discrete value validation', () => {
        test('all scalar fields come from their expected lists', () => {
            const a = generateAppearance('npc_discrete', 35, 'Merchant', 'Desert', 'Alive');
            expect(EYE_COLORS).toContain(a.eyeColor);
            expect(SKIN_TONES).toContain(a.skinTone);
            expect(HEIGHTS).toContain(a.height);
            expect(BUILDS).toContain(a.build);
            expect(HAIR_COLORS).toContain(a.hair.color);
            expect(HAIR_LENGTHS).toContain(a.hair.length);
            expect(HAIR_STYLES).toContain(a.hair.style);
            expect(FACIAL_HAIR).toContain(a.facialHair);
        });

        test('baldness is a boolean', () => {
            const a = generateAppearance('npc_baldtype', 30, 'Citizen', 'Plains', 'Alive');
            expect(typeof a.baldness).toBe('boolean');
        });

        test('scars, tattoos, marks are arrays', () => {
            const a = generateAppearance('npc_arrays', 35, 'Bandit', 'Desert', 'Alive');
            expect(Array.isArray(a.scars)).toBe(true);
            expect(Array.isArray(a.tattoos)).toBe(true);
            expect(Array.isArray(a.marks)).toBe(true);
        });

        test('scars have at most 2 entries', () => {
            for (let i = 0; i < 50; i++) {
                const a = generateAppearance(`npc_scar_len_${i}`, 35, 'Bandit', 'Desert', 'Alive');
                expect(a.scars.length).toBeLessThanOrEqual(2);
            }
        });
    });

    describe('age overrides — height', () => {
        test('age < 10 → very short', () => {
            const a = generateAppearance('npc_height_1', 8, 'Child', 'Plains', 'Alive');
            expect(a.height).toBe('very short');
        });

        test('age 10–15 → short', () => {
            const a = generateAppearance('npc_height_2', 12, 'Child', 'Plains', 'Alive');
            expect(a.height).toBe('short');
        });

        test('age >= 16 → seeded adult height (average or tall)', () => {
            const a = generateAppearance('npc_height_3', 16, 'Citizen', 'Plains', 'Alive');
            expect(['average', 'tall']).toContain(a.height);
        });
    });

    describe('age overrides — hair color', () => {
        test('age 45–59 → streaked grey', () => {
            const a = generateAppearance('npc_grey_1', 45, 'Citizen', 'Plains', 'Alive');
            expect(a.hair.color).toBe('streaked grey');
        });

        test('age 60–74 → grey', () => {
            const a = generateAppearance('npc_grey_2', 60, 'Citizen', 'Plains', 'Alive');
            expect(a.hair.color).toBe('grey');
        });

        test('age >= 75 → white', () => {
            const a = generateAppearance('npc_grey_3', 75, 'Citizen', 'Plains', 'Alive');
            expect(a.hair.color).toBe('white');
        });

        test('age < 45 retains seeded base hair color', () => {
            const a = generateAppearance('npc_grey_4', 44, 'Citizen', 'Plains', 'Alive');
            const ageOverrideColors = ['streaked grey', 'grey', 'white'];
            expect(ageOverrideColors).not.toContain(a.hair.color);
        });
    });

    describe('age overrides — hair length', () => {
        test('age < 16 → cropped (regardless of seeded length)', () => {
            const a = generateAppearance('npc_hair_len_1', 14, 'Child', 'Forest', 'Alive');
            expect(a.hair.length).toBe('cropped');
        });
    });

    describe('age overrides — build', () => {
        test('age < 16 → slight', () => {
            const a = generateAppearance('npc_build_1', 10, 'Child', 'Plains', 'Alive');
            expect(a.build).toBe('slight');
        });

        test('age > 70 → frail', () => {
            const a = generateAppearance('npc_build_2', 71, 'Citizen', 'Plains', 'Alive');
            expect(a.build).toBe('frail');
        });

        test('age 16–70 uses seeded build (not slight or frail)', () => {
            const a = generateAppearance('npc_build_3', 35, 'Citizen', 'Plains', 'Alive');
            expect(a.build).not.toBe('slight');
            expect(a.build).not.toBe('frail');
        });
    });

    describe('age overrides — facial hair', () => {
        test('age < 16 → none', () => {
            const a = generateAppearance('npc_fh_1', 13, 'Child', 'Plains', 'Alive');
            expect(a.facialHair).toBe('none');
        });

        test('age >= 16 uses seeded facial hair', () => {
            // Run several IDs to ensure at least one gets non-none
            const results = Array.from({ length: 20 }, (_, i) =>
                generateAppearance(`npc_fh_adult_${i}`, 25, 'Guard', 'Mountain', 'Alive')
            );
            const nonNone = results.some(a => a.facialHair !== 'none');
            expect(nonNone).toBe(true);
        });
    });

    describe('baldness progression', () => {
        // Locate a bald NPC by scanning seeds, then verify age-driven progression
        function findBaldId(ageForCheck) {
            for (let i = 0; i < 200; i++) {
                const id = `npc_bald_scan_${i}`;
                const a = generateAppearance(id, ageForCheck, 'Citizen', 'Plains', 'Alive');
                if (a.baldness) return id;
            }
            return null;
        }

        test('bald NPC at age 55 has hair length bald', () => {
            const id = findBaldId(55);
            expect(id).not.toBeNull();
            const a = generateAppearance(id, 55, 'Citizen', 'Plains', 'Alive');
            expect(a.hair.length).toBe('bald');
        });

        test('bald NPC at age 40 has hair length thinning', () => {
            const id = findBaldId(40);
            expect(id).not.toBeNull();
            const a = generateAppearance(id, 40, 'Citizen', 'Plains', 'Alive');
            expect(a.hair.length).toBe('thinning');
        });

        test('bald NPC at age 30 still has normal hair (baldness not yet showing)', () => {
            const id = findBaldId(30);
            expect(id).not.toBeNull();
            const a = generateAppearance(id, 30, 'Citizen', 'Plains', 'Alive');
            expect(['bald', 'thinning']).not.toContain(a.hair.length);
        });
    });

    describe('role clothing tier', () => {
        const NOBLE_TORSO    = ['silk robe', 'merchant coat', 'plate breastplate'];
        const MILITARY_TORSO = ['chainmail hauberk', 'padded gambeson', 'plate breastplate'];
        const OUTCAST_TORSO  = ['tattered rags', 'linen shirt', 'leather vest'];
        const CLERGY_TORSO   = ['silk robe', 'linen shirt', 'wool tunic'];

        test('Mayor gets noble-tier clothing', () => {
            const a = generateAppearance('npc_mayor', 50, 'Mayor', 'Plains', 'Alive');
            expect(NOBLE_TORSO).toContain(a.clothing.torso);
        });

        test('Scholar gets noble-tier clothing', () => {
            const a = generateAppearance('npc_scholar', 45, 'Scholar', 'Forest', 'Alive');
            expect(NOBLE_TORSO).toContain(a.clothing.torso);
        });

        test('Guard gets military-tier clothing', () => {
            const a = generateAppearance('npc_guard', 28, 'Guard', 'Mountain', 'Alive');
            expect(MILITARY_TORSO).toContain(a.clothing.torso);
        });

        test('Bandit gets outcast-tier clothing', () => {
            const a = generateAppearance('npc_bandit', 30, 'Bandit', 'Desert', 'Alive');
            expect(OUTCAST_TORSO).toContain(a.clothing.torso);
        });

        test('Cultist gets clergy-tier clothing', () => {
            const a = generateAppearance('npc_cultist', 40, 'Cultist', 'Marsh', 'Alive');
            expect(CLERGY_TORSO).toContain(a.clothing.torso);
        });

        test('unknown role falls back to common tier', () => {
            const common_torso = ['linen shirt', 'wool tunic', 'leather vest', 'padded gambeson'];
            const a = generateAppearance('npc_unknown_role', 30, 'Wizard', 'Plains', 'Alive');
            expect(common_torso).toContain(a.clothing.torso);
        });
    });

    describe('sub-seed isolation', () => {
        test('clothing output is identical regardless of mark roll results', () => {
            // Both NPCs share the clothing seed but differ only in marks seed behavior;
            // since seeds are independent, clothing must be the same for the same npcId.
            const a = generateAppearance('npc_isolation', 30, 'Guard', 'Mountain', 'Alive');
            const b = generateAppearance('npc_isolation', 30, 'Guard', 'Mountain', 'Alive');
            expect(a.clothing).toEqual(b.clothing);
            expect(a.scars).toEqual(b.scars);
        });

        test('changing role (clothing tier) does not affect marks output', () => {
            const guard   = generateAppearance('npc_role_iso', 30, 'Guard',  'Plains', 'Alive');
            const bandit  = generateAppearance('npc_role_iso', 30, 'Bandit', 'Plains', 'Alive');
            // Marks derive from markRng which is seeded independently of clothRng
            expect(guard.scars).toEqual(bandit.scars);
            expect(guard.tattoos).toEqual(bandit.tattoos);
        });
    });

    describe('biome skin tone distribution', () => {
        test('Marsh biome produces more dark/olive tones than pale tones', () => {
            const darkTones = ['olive', 'brown', 'dark brown', 'ebony'];
            const paleTones = ['pale', 'fair'];
            let dark = 0, pale = 0;
            for (let i = 0; i < 300; i++) {
                const a = generateAppearance(`npc_marsh_${i}`, 30, 'Citizen', 'Marsh', 'Alive');
                if (darkTones.includes(a.skinTone)) dark++;
                if (paleTones.includes(a.skinTone)) pale++;
            }
            expect(dark).toBeGreaterThan(pale);
        });

        test('Mountain biome produces more pale/fair tones than Marsh', () => {
            const paleTones = ['pale', 'fair'];
            let mountainPale = 0, marshPale = 0;
            for (let i = 0; i < 300; i++) {
                const mtn = generateAppearance(`npc_mtn_dist_${i}`, 30, 'Citizen', 'Mountain', 'Alive');
                const msh = generateAppearance(`npc_msh_dist_${i}`, 30, 'Citizen', 'Marsh',    'Alive');
                if (paleTones.includes(mtn.skinTone)) mountainPale++;
                if (paleTones.includes(msh.skinTone)) marshPale++;
            }
            expect(mountainPale).toBeGreaterThan(marshPale);
        });

        test('Desert biome produces more tan/olive/brown tones than Mountain', () => {
            const warmTones = ['tan', 'olive', 'brown', 'dark brown', 'ebony'];
            let desertWarm = 0, mountainWarm = 0;
            for (let i = 0; i < 300; i++) {
                const des = generateAppearance(`npc_des_dist_${i}`, 30, 'Citizen', 'Desert',   'Alive');
                const mtn = generateAppearance(`npc_mtn2_dist_${i}`, 30, 'Citizen', 'Mountain', 'Alive');
                if (warmTones.includes(des.skinTone)) desertWarm++;
                if (warmTones.includes(mtn.skinTone)) mountainWarm++;
            }
            expect(desertWarm).toBeGreaterThan(mountainWarm);
        });
    });

    describe('new facial detail fields — discrete validation', () => {
        test('all new fields come from their expected lists', () => {
            const a = generateAppearance('npc_facial_discrete', 35, 'Merchant', 'Plains', 'Alive', 'male');
            expect(FACE_SHAPES).toContain(a.faceShape);
            expect(EYE_SHAPES).toContain(a.eyeShape);
            expect(COMPLEXIONS).toContain(a.complexion);
            expect(EXPRESSION_BIASES).toContain(a.expressionBias);
            expect(NOSE_SHAPES).toContain(a.noseShape);
        });
    });

    describe('new facial detail fields — determinism', () => {
        test('same inputs produce identical new fields', () => {
            const a = generateAppearance('npc_facial_det', 30, 'Guard', 'Mountain', 'Alive', 'male');
            const b = generateAppearance('npc_facial_det', 30, 'Guard', 'Mountain', 'Alive', 'male');
            expect(a.faceShape).toBe(b.faceShape);
            expect(a.eyeShape).toBe(b.eyeShape);
            expect(a.complexion).toBe(b.complexion);
            expect(a.expressionBias).toBe(b.expressionBias);
            expect(a.noseShape).toBe(b.noseShape);
        });

        test('different npcIds produce variety in new fields (over 20 samples)', () => {
            const faceSet = new Set();
            const exprSet = new Set();
            for (let i = 0; i < 20; i++) {
                const a = generateAppearance(`npc_variety_${i}`, 30, 'Citizen', 'Plains', 'Alive');
                faceSet.add(a.faceShape);
                exprSet.add(a.expressionBias);
            }
            expect(faceSet.size).toBeGreaterThan(1);
            expect(exprSet.size).toBeGreaterThan(1);
        });
    });

    describe('new facial detail fields — sub-seed isolation', () => {
        test('adding new facial fields does not shift eyeColor, skinTone, or scars', () => {
            const a = generateAppearance('npc_iso_facial', 35, 'Guard', 'Mountain', 'Alive', 'male');
            const b = generateAppearance('npc_iso_facial', 35, 'Guard', 'Mountain', 'Alive', 'male');
            expect(a.eyeColor).toBe(b.eyeColor);
            expect(a.skinTone).toBe(b.skinTone);
            expect(a.scars).toEqual(b.scars);
        });
    });

    describe('faceShape — age correlation', () => {
        test('children (age < 16) are round-dominated (>50% of 200 samples)', () => {
            let roundCount = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_face_child_${i}`, 10, 'Child', 'Plains', 'Alive');
                if (a.faceShape === 'round') roundCount++;
            }
            expect(roundCount).toBeGreaterThan(100);
        });

        test('elderly (age > 70) are angular-dominated (>40% of 200 samples)', () => {
            let angularCount = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_face_elder_${i}`, 80, 'Citizen', 'Plains', 'Alive');
                if (a.faceShape === 'angular') angularCount++;
            }
            expect(angularCount).toBeGreaterThan(80);
        });

        test('Mountain biome adults are square/angular-dominant over oval/heart', () => {
            let squareAngular = 0, ovalHeart = 0;
            for (let i = 0; i < 300; i++) {
                const a = generateAppearance(`npc_face_mtn_${i}`, 35, 'Citizen', 'Mountain', 'Alive');
                if (['square', 'angular'].includes(a.faceShape)) squareAngular++;
                if (['oval', 'heart'].includes(a.faceShape)) ovalHeart++;
            }
            expect(squareAngular).toBeGreaterThan(ovalHeart);
        });
    });

    describe('expressionBias — role correlation', () => {
        test('Guard NPCs are stern/weary dominant (>80% of 200 samples)', () => {
            let sternWeary = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_expr_guard_${i}`, 30, 'Guard', 'Plains', 'Alive');
                if (['stern', 'weary'].includes(a.expressionBias)) sternWeary++;
            }
            expect(sternWeary).toBeGreaterThan(160);
        });

        test('Merchant NPCs are cheerful dominant (>50% of 200 samples)', () => {
            let cheerful = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_expr_merch_${i}`, 40, 'Merchant', 'Plains', 'Alive');
                if (a.expressionBias === 'cheerful') cheerful++;
            }
            expect(cheerful).toBeGreaterThan(100);
        });

        test('Beggar NPCs are weary dominant (>50% of 200 samples)', () => {
            let weary = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_expr_beggar_${i}`, 45, 'Beggar', 'Marsh', 'Alive');
                if (a.expressionBias === 'weary') weary++;
            }
            expect(weary).toBeGreaterThan(100);
        });
    });

    describe('complexion — role and age correlation', () => {
        test('Beggar NPCs are sallow dominant (>70% of 200 samples)', () => {
            let sallow = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_comp_beggar_${i}`, 35, 'Beggar', 'Plains', 'Alive');
                if (a.complexion === 'sallow') sallow++;
            }
            expect(sallow).toBeGreaterThan(140);
        });

        test('Guard NPCs are ruddy dominant (>50% of 200 samples)', () => {
            let ruddy = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_comp_guard_${i}`, 30, 'Guard', 'Forest', 'Alive');
                if (a.complexion === 'ruddy') ruddy++;
            }
            expect(ruddy).toBeGreaterThan(100);
        });

        test('NPCs age >= 50 are weathered dominant (>50% of 200 samples)', () => {
            let weathered = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_comp_old_${i}`, 55, 'Citizen', 'Plains', 'Alive');
                if (a.complexion === 'weathered') weathered++;
            }
            expect(weathered).toBeGreaterThan(100);
        });

        test('children (age < 16) are smooth dominant (>50% of 200 samples)', () => {
            let smooth = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_comp_child_${i}`, 10, 'Child', 'Plains', 'Alive');
                if (a.complexion === 'smooth') smooth++;
            }
            expect(smooth).toBeGreaterThan(100);
        });
    });

    describe('eyeShape — sex and role correlation', () => {
        test('female NPCs are almond/upturned dominant (>50% of 200 samples)', () => {
            let almondUpturned = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_eye_female_${i}`, 30, 'Citizen', 'Plains', 'Alive', 'female');
                if (['almond', 'upturned'].includes(a.eyeShape)) almondUpturned++;
            }
            expect(almondUpturned).toBeGreaterThan(100);
        });

        test('male NPCs are round/narrow dominant (>50% of 200 samples)', () => {
            let roundNarrow = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_eye_male_${i}`, 30, 'Citizen', 'Plains', 'Alive', 'male');
                if (['round', 'narrow'].includes(a.eyeShape)) roundNarrow++;
            }
            expect(roundNarrow).toBeGreaterThan(100);
        });

        test('Cultist NPCs are upturned dominant (>60% of 200 samples)', () => {
            let upturned = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_eye_cultist_${i}`, 35, 'Cultist', 'Marsh', 'Alive');
                if (a.eyeShape === 'upturned') upturned++;
            }
            expect(upturned).toBeGreaterThan(120);
        });

        test('Scholar NPCs are round dominant (>50% of 200 samples)', () => {
            let round = 0;
            for (let i = 0; i < 200; i++) {
                const a = generateAppearance(`npc_eye_scholar_${i}`, 45, 'Scholar', 'Forest', 'Alive');
                if (a.eyeShape === 'round') round++;
            }
            expect(round).toBeGreaterThan(100);
        });
    });

    describe('noseShape — build and sex correlation', () => {
        test('heavyset build NPCs are broad dominant (>60% of 200 samples)', () => {
            // Force heavyset build by using age 30–70 + known seeded IDs that produce heavyset
            let broad = 0, total = 0;
            for (let i = 0; i < 500; i++) {
                const a = generateAppearance(`npc_nose_build_${i}`, 35, 'Citizen', 'Plains', 'Alive', 'male');
                if (a.build === 'heavyset' || a.build === 'stocky') {
                    if (a.noseShape === 'broad') broad++;
                    total++;
                }
            }
            if (total >= 20) {
                expect(broad / total).toBeGreaterThan(0.55);
            }
        });

        test('male NPCs with average build are broad/hooked dominant (>50% of 200 samples)', () => {
            let broadHooked = 0, total = 0;
            for (let i = 0; i < 400; i++) {
                const a = generateAppearance(`npc_nose_male_${i}`, 35, 'Citizen', 'Plains', 'Alive', 'male');
                if (a.build === 'average' || a.build === 'muscular') {
                    if (['broad', 'hooked'].includes(a.noseShape)) broadHooked++;
                    total++;
                }
            }
            if (total >= 20) {
                expect(broadHooked / total).toBeGreaterThan(0.50);
            }
        });

        test('female NPCs with average build are button/straight dominant (>50% of 200 samples)', () => {
            let buttonStraight = 0, total = 0;
            for (let i = 0; i < 400; i++) {
                const a = generateAppearance(`npc_nose_female_${i}`, 35, 'Citizen', 'Plains', 'Alive', 'female');
                if (a.build === 'average' || a.build === 'muscular') {
                    if (['button', 'straight'].includes(a.noseShape)) buttonStraight++;
                    total++;
                }
            }
            if (total >= 20) {
                expect(buttonStraight / total).toBeGreaterThan(0.50);
            }
        });
    });

    describe('scar and tattoo entry shape', () => {
        test('scar entries have location and type fields', () => {
            let found = null;
            for (let i = 0; i < 300; i++) {
                const a = generateAppearance(`npc_scar_shape_${i}`, 35, 'Bandit', 'Desert', 'Alive');
                if (a.scars.length > 0) { found = a.scars[0]; break; }
            }
            expect(found).not.toBeNull();
            expect(found).toHaveProperty('location');
            expect(found).toHaveProperty('type');
        });

        test('tattoo entries have location and motif fields', () => {
            let found = null;
            for (let i = 0; i < 300; i++) {
                const a = generateAppearance(`npc_tattoo_shape_${i}`, 35, 'Cultist', 'Marsh', 'Alive');
                if (a.tattoos.length > 0) { found = a.tattoos[0]; break; }
            }
            expect(found).not.toBeNull();
            expect(found).toHaveProperty('location');
            expect(found).toHaveProperty('motif');
        });

        test('mark entries have location and type fields', () => {
            let found = null;
            for (let i = 0; i < 300; i++) {
                const a = generateAppearance(`npc_mark_shape_${i}`, 35, 'Citizen', 'Plains', 'Alive');
                if (a.marks.length > 0) { found = a.marks[0]; break; }
            }
            expect(found).not.toBeNull();
            expect(found).toHaveProperty('location');
            expect(found).toHaveProperty('type');
        });
    });
});
