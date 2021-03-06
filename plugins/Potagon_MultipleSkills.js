/*:
@plugindesc
スキル複数追加 Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_MultipleSkills.js

@help
スキルを複数覚えることを可能にします。

@param SkillTypeId
@type number
@text スキルタイプID
@desc 複数覚えることが出来るスキルタイプID
@default 3

@param ExcludeSkills
@type string[]
@text 除外スキル名
@desc 除外するスキル名

@param CompositeSkills
@type struct<CompositeSkills>[]
@text 複合スキル名
@desc 複合するスキルの情報

@param HideSkills
@type struct<HideSkills>[]
@text 隠すスキル名
@desc 特定のスキルを覚えているときスキルを非表示にする
下位互換のスキルを表示しない機能
*/

/*~struct~CompositeSkills:
@param before_name
@type string
@text 複合前元スキル名
@desc 複合前スキル名を名前で指定

@param composite_name
@type string
@text 複合スキル名
@desc 複合スキル名を名前で指定

@param count
@type number
@text 複合必要個数
@desc 複合に必要な個数
@default 2
*/

/*~struct~HideSkills:
@param name
@type string
@text 上位互換スキル名
@desc 上位互換スキル名を名前で指定

@param hide_skills
@type string[]
@text 隠すスキル名
@desc 隠すスキル名
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.1(2021/1/17)
- リファクタ(jshint で ES6 記法に統一)

・Ver1.1.0(2021/1/11)
- ベースプラグインを指定していなかったのを修正
- ベースプラグイン更新対応
- コピーライト更新
*/

// パラメータ定義
(() => {
    'use strict';

    // パラメータ用変数
    const plugin_name = Potagon.getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const SkillTypeId   = Number(params.SkillTypeId || 3);
    let ExcludeSkills   = [];
    let CompositeSkills = [];
    let HideSkills      = [];
    if (params.ExcludeSkills) {
        ExcludeSkills = Potagon.stringArray(params.ExcludeSkills);
    }
    if (params.CompositeSkills) {
        CompositeSkills = JSON.parse(params.CompositeSkills);
    }
    if (params.HideSkills) {
        HideSkills = JSON.parse(params.HideSkills);
    }

/**
 * This section contains some methods that will be added to the standard
 * Javascript objects.
 *
 * @namespace JsExtensions
 */

/**
 * Removes a given element from the array (in place).
 *
 * @memberof JsExtensions
 * @param {any} element - The element to remove.
 * @returns {array} The array after remove.
 */
Array.prototype.destroy = function(element) {
  const index = this.indexOf(element);
  if (index >= 0) {
      this.splice(index, 1);
  } else {
      return this;
  }
};


/**
 * アクターを扱うクラスです。
 * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
 * Game_Party クラス（$gameParty）からも参照されます。
 *
 * @class
 */

/**
 * スキルの習得済み判定
 *
 * @param {} skillId -
 * @returns {}
 */
Game_Actor.prototype.isLearnedSkill = function(skillId) {
    const skill = $dataSkills[skillId];
    if (skill.stypeId !== SkillTypeId || ExcludeSkills.includes(skill.name)) {
        return this._skills.includes(skillId);
    } else {
        return false;
    }
};

/**
 * スキルを覚える
 *
 * @param {number} skillId - スキルID
 */
Game_Actor.prototype.learnSkill = function(skillId) {
    if (!this.isLearnedSkill(skillId)) {
        this._skills.push(skillId);
        // ここで複合スキル判定
        for (let i = 0; i < CompositeSkills.length; i++) {
            let composite_data = JSON.parse(CompositeSkills[i]);
            let before_name    = composite_data.before_name;
            let composite_name = composite_data.composite_name;
            let count          = Number(composite_data.count || 2);
            let skill_count    = 0;

            for (const id of this._skills) {
                let skill = $dataSkills[id];

                // 複合前のスキルがあったら、複合判定
                if (skill.name === before_name) {
                    skill_count +=1;
                    // 複合条件を満たしたとき
                    if (skill_count === count) {
                        let skill_id = Potagon.nameSearch($dataSkills, composite_name, "id");
                        // 複合スキルが見つかったら
                        if (skill_id) {
                            // 複合するスキルを忘れる
                            for (let j = 0; j < skill_count; j++) {
                                this.forgetSkill(id);
                            }
                            // 複合スキルを覚える
                            this._skills.push(skill_id);
                        }
                    }
                }
            }


        }
        this._skills.sort((a, b) => a - b);
    }
};

/**
 * スキルを忘れる
 *
 * @param {} skillId -
 */
Game_Actor.prototype.forgetSkill = function(skillId) {
    this._skills.destroy(skillId);
};

/**
 * スキルオブジェクトの配列取得
 *
 * @returns {}
 */
Game_Actor.prototype.skills = function() {
    const list = [];
    let all_skills = this._skills.concat(this.addedSkills());

    // 隠しスキル判定
    for (let i = 0; i < HideSkills.length; i++) {
        let hide_data   = JSON.parse(HideSkills[i]);
        let name        = hide_data.name; // 上位互換スキル名
        let hide_skills = Potagon.stringArray(hide_data.hide_skills);
        let skill       = Potagon.nameSearch($dataSkills, name, false);

        // 上位互換スキルがあったら
        if (all_skills.includes(skill.id)) {
            for (let j = 0; j < hide_skills.length; j++) {
                let hide_skill = Potagon.nameSearch($dataSkills, hide_skills[j], false);
                // 隠しスキルがあったら
                if (all_skills.includes(hide_skill.id)) {
                    all_skills.remove(hide_skill.id);
                }
            }
        }
    }

    for (const id of all_skills) {
        let skill = $dataSkills[id];
        if (ExcludeSkills.includes(skill.name)) {
            if (!list.includes(skill)) {
                list.push(skill);
            }
        } else if (skill.stypeId == SkillTypeId || !list.includes(skill)) {
            list.push(skill);
        }
    }
    return list;
};

})();
