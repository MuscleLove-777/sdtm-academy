/* ============================================
   SDTM Academy - Level 5: 実践演習
   ============================================ */

const LEVEL5_DATA = {
    id: 5,
    title: "実践演習",
    icon: "🎯",
    description: "総合的な実践演習でSDTMスキルを仕上げる",
    modules: [
        {
            id: 501,
            title: "総合マッピング演習",
            duration: "45分",
            content: `
<h2>模擬試験 ABC-001 概要</h2>
<p>この演習では、架空の臨床試験<strong>ABC-001</strong>のRawデータをSDTM形式にマッピングします。実務と同様のステップを一つずつ実践しましょう。</p>

<table>
<thead>
<tr><th>項目</th><th>内容</th></tr>
</thead>
<tbody>
<tr><td><strong>試験番号</strong></td><td>ABC-001</td></tr>
<tr><td><strong>フェーズ</strong></td><td>Phase III</td></tr>
<tr><td><strong>対象疾患</strong></td><td>2型糖尿病（Type 2 Diabetes Mellitus）</td></tr>
<tr><td><strong>治療群</strong></td><td>Drug A 10mg / Drug A 20mg / Placebo</td></tr>
<tr><td><strong>被験者数</strong></td><td>450名（各群150名）</td></tr>
<tr><td><strong>治験実施施設</strong></td><td>Site 101〜110（10施設）</td></tr>
<tr><td><strong>治療期間</strong></td><td>24週間</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">💡 演習の進め方</div>
各ドメインについて、CRFで収集されたRawデータを確認し、SDTMへの変換過程を理解してください。SASとRの両方のコードを掲載しています。
</div>

<h2>1. Demographics（DM）ドメインのマッピング</h2>

<h3>Raw CRFデータ（人口統計学的情報）</h3>
<table>
<thead>
<tr><th>被験者番号</th><th>施設</th><th>イニシャル</th><th>性別</th><th>生年月日</th><th>人種</th><th>同意取得日</th><th>割付群</th></tr>
</thead>
<tbody>
<tr><td>0001</td><td>101</td><td>YT</td><td>男</td><td>1965/03/15</td><td>アジア人</td><td>2024/01/10</td><td>Drug A 10mg</td></tr>
<tr><td>0002</td><td>101</td><td>KS</td><td>女</td><td>1972/08/22</td><td>アジア人</td><td>2024/01/12</td><td>Placebo</td></tr>
<tr><td>0003</td><td>102</td><td>MN</td><td>男</td><td>1958/11/03</td><td>白人</td><td>2024/01/15</td><td>Drug A 20mg</td></tr>
</tbody>
</table>

<h3>SDTM DMドメイン出力</h3>
<table>
<thead>
<tr><th>STUDYID</th><th>DOMAIN</th><th>USUBJID</th><th>SUBJID</th><th>RFSTDTC</th><th>RFENDTC</th><th>SITEID</th><th>AGE</th><th>AGEU</th><th>SEX</th><th>RACE</th><th>ARMCD</th><th>ARM</th><th>COUNTRY</th></tr>
</thead>
<tbody>
<tr><td>ABC-001</td><td>DM</td><td>ABC-001-101-0001</td><td>0001</td><td>2024-01-15</td><td>2024-07-10</td><td>101</td><td>58</td><td>YEARS</td><td>M</td><td>ASIAN</td><td>DRUGA10</td><td>Drug A 10mg</td><td>JPN</td></tr>
<tr><td>ABC-001</td><td>DM</td><td>ABC-001-101-0002</td><td>0002</td><td>2024-01-17</td><td>2024-07-12</td><td>101</td><td>51</td><td>YEARS</td><td>F</td><td>ASIAN</td><td>PBO</td><td>Placebo</td><td>JPN</td></tr>
<tr><td>ABC-001</td><td>DM</td><td>ABC-001-102-0003</td><td>0003</td><td>2024-01-20</td><td>2024-07-15</td><td>102</td><td>65</td><td>YEARS</td><td>M</td><td>WHITE</td><td>DRUGA20</td><td>Drug A 20mg</td><td>JPN</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ DMマッピングのポイント</div>
・イニシャルはSDTMに含めない（個人情報保護）<br>
・生年月日もBRTHDTCとして保持するが、提出時は年のみ（YYYY）にする場合がある<br>
・性別：男→M、女→F（CDISC CT）<br>
・人種：アジア人→ASIAN、白人→WHITE（CDISC CT）<br>
・RFSTDTC = 初回治験薬投与日（同意取得日ではない）<br>
・AGEはRFSTDTC時点で算出
</div>

<h3>DMマッピングコード</h3>
<div class="code-tabs">
  <div class="code-tab-buttons">
    <button class="code-tab-btn active" onclick="App.switchCodeTab(this, 'sas')">SAS</button>
    <button class="code-tab-btn" onclick="App.switchCodeTab(this, 'r')">R</button>
  </div>
  <div class="code-tab-content active" data-lang="sas">
    <div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* DM Domain Mapping - ABC-001 */
data sdtm.dm;
  set raw.demographics;

  /* Identifier variables */
  STUDYID = "ABC-001";
  DOMAIN  = "DM";
  USUBJID = catx("-", "ABC-001", put(site, z3.), put(subjno, z4.));
  SUBJID  = put(subjno, z4.);
  SITEID  = put(site, z3.);

  /* Reference dates from disposition */
  RFSTDTC = put(first_dose_dt, is8601da.);
  RFENDTC = put(last_dose_dt, is8601da.);

  /* Demographics */
  if sex_raw = "男" then SEX = "M";
  else if sex_raw = "女" then SEX = "F";

  select(race_raw);
    when("アジア人")  RACE = "ASIAN";
    when("白人")      RACE = "WHITE";
    when("黒人")      RACE = "BLACK OR AFRICAN AMERICAN";
    otherwise         RACE = "OTHER";
  end;

  /* Age calculation at RFSTDTC */
  AGE  = intck('year', birth_dt, first_dose_dt, 'C');
  AGEU = "YEARS";

  /* Arm */
  ARMCD = armcd_raw;
  ARM   = arm_raw;

  COUNTRY = "JPN";

  keep STUDYID DOMAIN USUBJID SUBJID RFSTDTC RFENDTC
       SITEID AGE AGEU SEX RACE ARMCD ARM COUNTRY;
run;</code></pre></div>
  </div>
  <div class="code-tab-content" data-lang="r">
    <div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r"># DM Domain Mapping - ABC-001
library(dplyr)
library(lubridate)

dm <- raw_demographics %>%
  mutate(
    STUDYID = "ABC-001",
    DOMAIN  = "DM",
    USUBJID = paste("ABC-001",
                    sprintf("%03d", site),
                    sprintf("%04d", subjno), sep = "-"),
    SUBJID  = sprintf("%04d", subjno),
    SITEID  = sprintf("%03d", site),

    # Reference dates
    RFSTDTC = format(first_dose_dt, "%Y-%m-%d"),
    RFENDTC = format(last_dose_dt, "%Y-%m-%d"),

    # Demographics
    SEX = case_when(
      sex_raw == "男" ~ "M",
      sex_raw == "女" ~ "F",
      TRUE ~ "U"
    ),
    RACE = case_when(
      race_raw == "アジア人" ~ "ASIAN",
      race_raw == "白人"     ~ "WHITE",
      race_raw == "黒人"     ~ "BLACK OR AFRICAN AMERICAN",
      TRUE ~ "OTHER"
    ),

    # Age at RFSTDTC
    AGE  = floor(interval(birth_dt, first_dose_dt) / years(1)),
    AGEU = "YEARS",

    ARMCD   = armcd_raw,
    ARM     = arm_raw,
    COUNTRY = "JPN"
  ) %>%
  select(STUDYID, DOMAIN, USUBJID, SUBJID, RFSTDTC, RFENDTC,
         SITEID, AGE, AGEU, SEX, RACE, ARMCD, ARM, COUNTRY)</code></pre></div>
  </div>
</div>

<h2>2. Vital Signs（VS）ドメインのマッピング</h2>

<h3>Raw CRFデータ（バイタルサイン - Wide Format）</h3>
<table>
<thead>
<tr><th>被験者</th><th>来院</th><th>測定日</th><th>収縮期血圧</th><th>拡張期血圧</th><th>脈拍数</th><th>体温</th><th>体重</th></tr>
</thead>
<tbody>
<tr><td>0001</td><td>Visit 1</td><td>2024/01/10</td><td>132</td><td>84</td><td>72</td><td>36.5</td><td>78.2</td></tr>
<tr><td>0001</td><td>Visit 2</td><td>2024/02/07</td><td>128</td><td>80</td><td>70</td><td>36.4</td><td>77.8</td></tr>
<tr><td>0002</td><td>Visit 1</td><td>2024/01/12</td><td>118</td><td>76</td><td>68</td><td>36.3</td><td>62.5</td></tr>
</tbody>
</table>

<h3>SDTM VSドメイン出力（Long Format）</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>VSTESTCD</th><th>VSTEST</th><th>VSORRES</th><th>VSORRESU</th><th>VSSTRESC</th><th>VSSTRESN</th><th>VSSTRESU</th><th>VISITNUM</th><th>VISIT</th><th>VSDTC</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-101-0001</td><td>SYSBP</td><td>Systolic Blood Pressure</td><td>132</td><td>mmHg</td><td>132</td><td>132</td><td>mmHg</td><td>1</td><td>Visit 1</td><td>2024-01-10</td></tr>
<tr><td>ABC-001-101-0001</td><td>DIABP</td><td>Diastolic Blood Pressure</td><td>84</td><td>mmHg</td><td>84</td><td>84</td><td>mmHg</td><td>1</td><td>Visit 1</td><td>2024-01-10</td></tr>
<tr><td>ABC-001-101-0001</td><td>PULSE</td><td>Pulse Rate</td><td>72</td><td>beats/min</td><td>72</td><td>72</td><td>beats/min</td><td>1</td><td>Visit 1</td><td>2024-01-10</td></tr>
<tr><td>ABC-001-101-0001</td><td>TEMP</td><td>Temperature</td><td>36.5</td><td>C</td><td>36.5</td><td>36.5</td><td>C</td><td>1</td><td>Visit 1</td><td>2024-01-10</td></tr>
<tr><td>ABC-001-101-0001</td><td>WEIGHT</td><td>Weight</td><td>78.2</td><td>kg</td><td>78.2</td><td>78.2</td><td>kg</td><td>1</td><td>Visit 1</td><td>2024-01-10</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">💡 Wide→Long変換（Transpose）</div>
CRFでは1行に複数の検査項目が並ぶ横持ち（Wide Format）が一般的ですが、SDTMでは1行1検査項目の縦持ち（Long Format）に変換します。VSTESTCDにはCDISC CTの標準コードを割り当てます。
</div>

<h3>VSTESTCDの割り当て</h3>
<table>
<thead>
<tr><th>CRF項目名</th><th>VSTESTCD</th><th>VSTEST</th><th>VSORRESU</th></tr>
</thead>
<tbody>
<tr><td>収縮期血圧</td><td>SYSBP</td><td>Systolic Blood Pressure</td><td>mmHg</td></tr>
<tr><td>拡張期血圧</td><td>DIABP</td><td>Diastolic Blood Pressure</td><td>mmHg</td></tr>
<tr><td>脈拍数</td><td>PULSE</td><td>Pulse Rate</td><td>beats/min</td></tr>
<tr><td>体温</td><td>TEMP</td><td>Temperature</td><td>C</td></tr>
<tr><td>体重</td><td>WEIGHT</td><td>Weight</td><td>kg</td></tr>
<tr><td>身長</td><td>HEIGHT</td><td>Height</td><td>cm</td></tr>
<tr><td>BMI</td><td>BMI</td><td>BMI</td><td>kg/m2</td></tr>
</tbody>
</table>

<h3>VSマッピングコード</h3>
<div class="code-tabs">
  <div class="code-tab-buttons">
    <button class="code-tab-btn active" onclick="App.switchCodeTab(this, 'sas')">SAS</button>
    <button class="code-tab-btn" onclick="App.switchCodeTab(this, 'r')">R</button>
  </div>
  <div class="code-tab-content active" data-lang="sas">
    <div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* VS Domain Mapping - Wide to Long Transpose */
data vs_long;
  set raw.vitals;
  length VSTESTCD $8 VSTEST $40 VSORRESU $20;

  array vals{5}   sysbp diabp pulse temp weight;
  array tcd{5} $8 ("SYSBP" "DIABP" "PULSE" "TEMP" "WEIGHT");
  array tst{5} $40 ("Systolic Blood Pressure"
                     "Diastolic Blood Pressure"
                     "Pulse Rate"
                     "Temperature"
                     "Weight");
  array unt{5} $20 ("mmHg" "mmHg" "beats/min" "C" "kg");

  do i = 1 to 5;
    if not missing(vals{i}) then do;
      VSTESTCD = tcd{i};
      VSTEST   = tst{i};
      VSORRES  = strip(put(vals{i}, best.));
      VSORRESU = unt{i};
      VSSTRESC = VSORRES;
      VSSTRESN = vals{i};
      VSSTRESU = VSORRESU;
      output;
    end;
  end;
  drop i sysbp diabp pulse temp weight;
run;

/* Add identifier and timing variables */
data sdtm.vs;
  set vs_long;

  STUDYID = "ABC-001";
  DOMAIN  = "VS";
  USUBJID = catx("-", "ABC-001", put(site, z3.), put(subjno, z4.));
  VSSEQ   = _N_;
  VSDTC   = put(measure_dt, is8601da.);
  VISITNUM = visitnum_raw;
  VISIT    = visit_raw;
  VSBLFL   = ifc(visitnum_raw = 1, "Y", "");
run;</code></pre></div>
  </div>
  <div class="code-tab-content" data-lang="r">
    <div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r"># VS Domain Mapping - Wide to Long with tidyr::pivot_longer
library(dplyr)
library(tidyr)

# Define TESTCD mapping
vs_map <- tribble(
  ~crf_col,  ~VSTESTCD, ~VSTEST,                       ~VSORRESU,
  "sysbp",   "SYSBP",   "Systolic Blood Pressure",     "mmHg",
  "diabp",   "DIABP",   "Diastolic Blood Pressure",    "mmHg",
  "pulse",   "PULSE",   "Pulse Rate",                  "beats/min",
  "temp",    "TEMP",    "Temperature",                 "C",
  "weight",  "WEIGHT",  "Weight",                      "kg"
)

vs <- raw_vitals %>%
  pivot_longer(
    cols = c(sysbp, diabp, pulse, temp, weight),
    names_to = "crf_col",
    values_to = "value"
  ) %>%
  filter(!is.na(value)) %>%
  left_join(vs_map, by = "crf_col") %>%
  mutate(
    STUDYID  = "ABC-001",
    DOMAIN   = "VS",
    USUBJID  = paste("ABC-001",
                     sprintf("%03d", site),
                     sprintf("%04d", subjno), sep = "-"),
    VSORRES  = as.character(value),
    VSSTRESC = VSORRES,
    VSSTRESN = value,
    VSSTRESU = VSORRESU,
    VSDTC    = format(measure_dt, "%Y-%m-%d"),
    VISITNUM = visitnum_raw,
    VISIT    = visit_raw,
    VSBLFL   = if_else(visitnum_raw == 1, "Y", "")
  ) %>%
  group_by(USUBJID) %>%
  mutate(VSSEQ = row_number()) %>%
  ungroup() %>%
  select(STUDYID, DOMAIN, USUBJID, VSSEQ, VSTESTCD, VSTEST,
         VSORRES, VSORRESU, VSSTRESC, VSSTRESN, VSSTRESU,
         VISITNUM, VISIT, VSDTC, VSBLFL)</code></pre></div>
  </div>
</div>

<h2>3. Adverse Events（AE）ドメインのマッピング</h2>

<h3>Raw CRFデータ（有害事象）</h3>
<table>
<thead>
<tr><th>被験者</th><th>有害事象名（Verbatim）</th><th>発現日</th><th>転帰日</th><th>重症度</th><th>重篤</th><th>因果関係</th><th>処置</th><th>転帰</th></tr>
</thead>
<tbody>
<tr><td>0001</td><td>頭が痛い</td><td>2024/01/20</td><td>2024/01/22</td><td>軽度</td><td>いいえ</td><td>関連あるかもしれない</td><td>薬剤投与</td><td>回復</td></tr>
<tr><td>0001</td><td>お腹がゆるい</td><td>2024/02/05</td><td>2024/02/08</td><td>中等度</td><td>いいえ</td><td>多分関連あり</td><td>薬剤投与</td><td>回復</td></tr>
<tr><td>0002</td><td>めまいがする</td><td>2024/01/25</td><td></td><td>軽度</td><td>いいえ</td><td>関連なし</td><td>なし</td><td>未回復</td></tr>
</tbody>
</table>

<h3>SDTM AEドメイン出力</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>AETERM</th><th>AEDECOD</th><th>AEBODSYS</th><th>AESTDTC</th><th>AEENDTC</th><th>AESEV</th><th>AESER</th><th>AEREL</th><th>AEACN</th><th>AEOUT</th><th>AESTDY</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-101-0001</td><td>頭が痛い</td><td>Headache</td><td>Nervous system disorders</td><td>2024-01-20</td><td>2024-01-22</td><td>MILD</td><td>N</td><td>POSSIBLE</td><td>DRUG ADMINISTERED</td><td>RECOVERED/RESOLVED</td><td>6</td></tr>
<tr><td>ABC-001-101-0001</td><td>お腹がゆるい</td><td>Diarrhoea</td><td>Gastrointestinal disorders</td><td>2024-02-05</td><td>2024-02-08</td><td>MODERATE</td><td>N</td><td>PROBABLE</td><td>DRUG ADMINISTERED</td><td>RECOVERED/RESOLVED</td><td>22</td></tr>
<tr><td>ABC-001-101-0002</td><td>めまいがする</td><td>Dizziness</td><td>Nervous system disorders</td><td>2024-01-25</td><td></td><td>MILD</td><td>N</td><td>NOT RELATED</td><td>NONE</td><td>NOT RECOVERED/NOT RESOLVED</td><td>9</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ AEマッピングのポイント</div>
・<strong>AETERM</strong>：CRFに記載されたVerbatim（原語）をそのまま保持<br>
・<strong>AEDECOD</strong>：MedDRA辞書でコーディングされたPreferred Term（PT）<br>
・<strong>AEBODSYS</strong>：MedDRA System Organ Class（SOC）<br>
・重症度・因果関係等はCDISC CTに変換（軽度→MILD、関連あるかもしれない→POSSIBLE）<br>
・<strong>AESTDY</strong>（Study Day）= AESTDTC - RFSTDTC + 1（RFSTDTCと同日なら1、投与前はマイナス、Day 0は存在しない）
</div>

<h3>Study Day（--DY）の計算ルール</h3>
<table>
<thead>
<tr><th>条件</th><th>計算式</th><th>例（RFSTDTC=2024-01-15）</th></tr>
</thead>
<tbody>
<tr><td>基準日以降</td><td>日付 - RFSTDTC + 1</td><td>2024-01-20 → Day 6</td></tr>
<tr><td>基準日当日</td><td>1</td><td>2024-01-15 → Day 1</td></tr>
<tr><td>基準日より前</td><td>日付 - RFSTDTC</td><td>2024-01-10 → Day -5</td></tr>
</tbody>
</table>

<h3>AEマッピングコード</h3>
<div class="code-tabs">
  <div class="code-tab-buttons">
    <button class="code-tab-btn active" onclick="App.switchCodeTab(this, 'sas')">SAS</button>
    <button class="code-tab-btn" onclick="App.switchCodeTab(this, 'r')">R</button>
  </div>
  <div class="code-tab-content active" data-lang="sas">
    <div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* AE Domain Mapping - ABC-001 */
proc sql;
  create table ae_merge as
  select a.*, b.rfstdtc_num
  from raw.adverse_events a
  left join sdtm.dm(keep=usubjid rfstdtc rename=(rfstdtc=rfstdtc_c)) b
    on a.usubjid_raw = b.usubjid;
quit;

data sdtm.ae;
  set ae_merge;

  STUDYID = "ABC-001";
  DOMAIN  = "AE";
  AESEQ   = _N_;

  /* Verbatim term - keep as-is from CRF */
  AETERM = verbatim_term;

  /* MedDRA coded terms (from coding system) */
  AEDECOD  = meddra_pt;
  AEBODSYS = meddra_soc;

  /* Severity mapping */
  select(severity_raw);
    when("軽度")   AESEV = "MILD";
    when("中等度") AESEV = "MODERATE";
    when("重度")   AESEV = "SEVERE";
    otherwise      AESEV = "";
  end;

  /* Serious flag */
  AESER = ifc(serious_raw = "はい", "Y", "N");

  /* Causality */
  select(causality_raw);
    when("関連なし")               AEREL = "NOT RELATED";
    when("関連あるかもしれない")   AEREL = "POSSIBLE";
    when("多分関連あり")           AEREL = "PROBABLE";
    when("関連あり")               AEREL = "RELATED";
    otherwise                      AEREL = "";
  end;

  /* Action taken */
  select(action_raw);
    when("なし")       AEACN = "NONE";
    when("薬剤投与")   AEACN = "DRUG ADMINISTERED";
    when("投与中止")   AEACN = "DRUG WITHDRAWN";
    otherwise          AEACN = "";
  end;

  /* Outcome */
  select(outcome_raw);
    when("回復")   AEOUT = "RECOVERED/RESOLVED";
    when("未回復") AEOUT = "NOT RECOVERED/NOT RESOLVED";
    when("後遺症") AEOUT = "RECOVERED/RESOLVED WITH SEQUELAE";
    when("死亡")   AEOUT = "FATAL";
    otherwise      AEOUT = "";
  end;

  /* Dates - ISO 8601 */
  AESTDTC = put(onset_dt, is8601da.);
  AEENDTC = put(resolve_dt, is8601da.);

  /* Study Day calculation */
  if not missing(onset_dt) and not missing(rfstdtc_num) then do;
    if onset_dt >= rfstdtc_num then
      AESTDY = onset_dt - rfstdtc_num + 1;
    else
      AESTDY = onset_dt - rfstdtc_num;
  end;
run;</code></pre></div>
  </div>
  <div class="code-tab-content" data-lang="r">
    <div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r"># AE Domain Mapping - ABC-001
library(dplyr)

# Get RFSTDTC from DM for study day calculation
dm_ref <- dm %>% select(USUBJID, RFSTDTC)

ae <- raw_adverse_events %>%
  mutate(
    STUDYID = "ABC-001",
    DOMAIN  = "AE",
    AETERM  = verbatim_term,
    AEDECOD  = meddra_pt,
    AEBODSYS = meddra_soc,

    AESEV = case_when(
      severity_raw == "軽度"   ~ "MILD",
      severity_raw == "中等度" ~ "MODERATE",
      severity_raw == "重度"   ~ "SEVERE"
    ),
    AESER = if_else(serious_raw == "はい", "Y", "N"),
    AEREL = case_when(
      causality_raw == "関連なし"             ~ "NOT RELATED",
      causality_raw == "関連あるかもしれない" ~ "POSSIBLE",
      causality_raw == "多分関連あり"         ~ "PROBABLE",
      causality_raw == "関連あり"             ~ "RELATED"
    ),
    AEACN = case_when(
      action_raw == "なし"     ~ "NONE",
      action_raw == "薬剤投与" ~ "DRUG ADMINISTERED",
      action_raw == "投与中止" ~ "DRUG WITHDRAWN"
    ),
    AEOUT = case_when(
      outcome_raw == "回復"   ~ "RECOVERED/RESOLVED",
      outcome_raw == "未回復" ~ "NOT RECOVERED/NOT RESOLVED",
      outcome_raw == "後遺症" ~ "RECOVERED/RESOLVED WITH SEQUELAE",
      outcome_raw == "死亡"   ~ "FATAL"
    ),
    AESTDTC = format(onset_dt, "%Y-%m-%d"),
    AEENDTC = format(resolve_dt, "%Y-%m-%d")
  ) %>%
  left_join(dm_ref, by = c("usubjid_raw" = "USUBJID")) %>%
  mutate(
    rfstdtc_dt = as.Date(RFSTDTC),
    # Study Day: no Day 0
    AESTDY = case_when(
      onset_dt >= rfstdtc_dt ~
        as.numeric(onset_dt - rfstdtc_dt) + 1,
      onset_dt < rfstdtc_dt ~
        as.numeric(onset_dt - rfstdtc_dt)
    )
  ) %>%
  group_by(USUBJID) %>%
  mutate(AESEQ = row_number()) %>%
  ungroup()</code></pre></div>
  </div>
</div>

<h2>4. Laboratory Results（LB）ドメインのマッピング</h2>

<h3>Raw CRFデータ（臨床検査）</h3>
<table>
<thead>
<tr><th>被験者</th><th>検査日</th><th>検査項目</th><th>結果値</th><th>単位</th><th>基準値下限</th><th>基準値上限</th><th>異常フラグ</th></tr>
</thead>
<tbody>
<tr><td>0001</td><td>2024/01/10</td><td>HbA1c</td><td>7.8</td><td>%</td><td>4.6</td><td>6.2</td><td>H</td></tr>
<tr><td>0001</td><td>2024/01/10</td><td>空腹時血糖</td><td>156</td><td>mg/dL</td><td>70</td><td>110</td><td>H</td></tr>
<tr><td>0001</td><td>2024/01/10</td><td>ALT</td><td>28</td><td>U/L</td><td>5</td><td>45</td><td></td></tr>
<tr><td>0001</td><td>2024/01/10</td><td>クレアチニン</td><td>0.9</td><td>mg/dL</td><td>0.6</td><td>1.1</td><td></td></tr>
<tr><td>0002</td><td>2024/01/12</td><td>HbA1c</td><td>8.2</td><td>%</td><td>4.6</td><td>6.2</td><td>H</td></tr>
</tbody>
</table>

<h3>SDTM LBドメイン出力</h3>
<table>
<thead>
<tr><th>USUBJID</th><th>LBTESTCD</th><th>LBTEST</th><th>LBORRES</th><th>LBORRESU</th><th>LBSTRESC</th><th>LBSTRESN</th><th>LBSTRESU</th><th>LBORNRLO</th><th>LBORNRHI</th><th>LBNRIND</th></tr>
</thead>
<tbody>
<tr><td>ABC-001-101-0001</td><td>HBA1C</td><td>Hemoglobin A1C</td><td>7.8</td><td>%</td><td>7.8</td><td>7.8</td><td>%</td><td>4.6</td><td>6.2</td><td>HIGH</td></tr>
<tr><td>ABC-001-101-0001</td><td>GLUC</td><td>Glucose</td><td>156</td><td>mg/dL</td><td>8.66</td><td>8.66</td><td>mmol/L</td><td>70</td><td>110</td><td>HIGH</td></tr>
<tr><td>ABC-001-101-0001</td><td>ALT</td><td>Alanine Aminotransferase</td><td>28</td><td>U/L</td><td>28</td><td>28</td><td>U/L</td><td>5</td><td>45</td><td>NORMAL</td></tr>
<tr><td>ABC-001-101-0001</td><td>CREAT</td><td>Creatinine</td><td>0.9</td><td>mg/dL</td><td>79.56</td><td>79.56</td><td>umol/L</td><td>0.6</td><td>1.1</td><td>NORMAL</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ LBマッピングの重要ポイント</div>
・<strong>LBORRES/LBORRESU</strong>：原データの結果と単位をそのまま保持<br>
・<strong>LBSTRESC/LBSTRESN/LBSTRESU</strong>：標準単位に変換した結果（SI単位への変換が必要な場合あり）<br>
・<strong>文字→数値変換</strong>：LBORRESは文字型、LBSTRESNは数値型（"&lt;0.5" のような値はLBSTRESCに保持、LBSTRESNはnull）<br>
・<strong>LBNRIND</strong>：正常範囲の判定（NORMAL / HIGH / LOW / ABNORMAL）<br>
・<strong>基準値</strong>：LBORNRLO/LBORNRHI は原データの基準値、LBSTNRLO/LBSTNRHIは標準単位の基準値
</div>

<h3>LBマッピングコード</h3>
<div class="code-tabs">
  <div class="code-tab-buttons">
    <button class="code-tab-btn active" onclick="App.switchCodeTab(this, 'sas')">SAS</button>
    <button class="code-tab-btn" onclick="App.switchCodeTab(this, 'r')">R</button>
  </div>
  <div class="code-tab-content active" data-lang="sas">
    <div class="code-block"><div class="code-block-header"><span class="code-lang">SAS</span></div><pre><code class="language-sas">/* LB Domain Mapping - ABC-001 */
/* Step 1: Create TESTCD lookup */
proc format;
  value $lbtestcd
    "HbA1c"        = "HBA1C"
    "空腹時血糖"   = "GLUC"
    "ALT"          = "ALT"
    "クレアチニン" = "CREAT"
    other          = "";

  value $lbtest
    "HBA1C" = "Hemoglobin A1C"
    "GLUC"  = "Glucose"
    "ALT"   = "Alanine Aminotransferase"
    "CREAT" = "Creatinine";
run;

/* Step 2: Map and standardize */
data sdtm.lb;
  set raw.lab_results;

  STUDYID  = "ABC-001";
  DOMAIN   = "LB";
  LBTESTCD = put(test_raw, $lbtestcd.);
  LBTEST   = put(LBTESTCD, $lbtest.);

  /* Original results - character */
  LBORRES  = strip(put(result_val, best.));
  LBORRESU = unit_raw;
  LBORNRLO = strip(put(nrlo_raw, best.));
  LBORNRHI = strip(put(nrhi_raw, best.));

  /* Standard results - SI unit conversion */
  select(LBTESTCD);
    when("GLUC") do;
      /* mg/dL -> mmol/L: divide by 18.0 */
      LBSTRESN = round(result_val / 18.0, 0.01);
      LBSTRESU = "mmol/L";
    end;
    when("CREAT") do;
      /* mg/dL -> umol/L: multiply by 88.4 */
      LBSTRESN = round(result_val * 88.4, 0.01);
      LBSTRESU = "umol/L";
    end;
    otherwise do;
      LBSTRESN = result_val;
      LBSTRESU = unit_raw;
    end;
  end;
  LBSTRESC = strip(put(LBSTRESN, best.));

  /* Normal range indicator */
  if not missing(result_val) then do;
    if result_val > nrhi_raw then LBNRIND = "HIGH";
    else if result_val < nrlo_raw then LBNRIND = "LOW";
    else LBNRIND = "NORMAL";
  end;

  LBDTC = put(lab_dt, is8601da.);
run;</code></pre></div>
  </div>
  <div class="code-tab-content" data-lang="r">
    <div class="code-block"><div class="code-block-header"><span class="code-lang">R</span></div><pre><code class="language-r"># LB Domain Mapping - ABC-001
library(dplyr)

# TESTCD mapping table
lb_map <- tribble(
  ~test_raw,       ~LBTESTCD, ~LBTEST,
  "HbA1c",         "HBA1C",   "Hemoglobin A1C",
  "空腹時血糖",    "GLUC",    "Glucose",
  "ALT",           "ALT",     "Alanine Aminotransferase",
  "クレアチニン",  "CREAT",   "Creatinine"
)

lb <- raw_lab_results %>%
  left_join(lb_map, by = "test_raw") %>%
  mutate(
    STUDYID  = "ABC-001",
    DOMAIN   = "LB",
    LBORRES  = as.character(result_val),
    LBORRESU = unit_raw,
    LBORNRLO = as.character(nrlo_raw),
    LBORNRHI = as.character(nrhi_raw),

    # SI unit conversion
    LBSTRESN = case_when(
      LBTESTCD == "GLUC"  ~ round(result_val / 18.0, 2),
      LBTESTCD == "CREAT" ~ round(result_val * 88.4, 2),
      TRUE ~ result_val
    ),
    LBSTRESU = case_when(
      LBTESTCD == "GLUC"  ~ "mmol/L",
      LBTESTCD == "CREAT" ~ "umol/L",
      TRUE ~ unit_raw
    ),
    LBSTRESC = as.character(LBSTRESN),

    # Normal range indicator
    LBNRIND = case_when(
      result_val > nrhi_raw ~ "HIGH",
      result_val < nrlo_raw ~ "LOW",
      TRUE ~ "NORMAL"
    ),

    LBDTC = format(lab_dt, "%Y-%m-%d")
  ) %>%
  group_by(USUBJID) %>%
  mutate(LBSEQ = row_number()) %>%
  ungroup()</code></pre></div>
  </div>
</div>

<div class="info-box success">
<div class="info-box-title">✅ 総合マッピング演習のまとめ</div>
4つのドメイン（DM, VS, AE, LB）のマッピングを通じて、以下のスキルを確認しました：<br>
・Rawデータからの変数マッピングとControlled Terminology適用<br>
・Wide→Long変換（Transpose）のテクニック<br>
・Verbatim用語の辞書コーディング（MedDRA）<br>
・単位変換と基準値処理<br>
・Study Day計算（Day 0が存在しないルール）<br>
・ISO 8601日付形式への変換
</div>
`,
            quiz: [
                { id: "q501_1", type: "choice", question: "DMドメインのRFSTDTCは何を表しますか？", options: ["同意取得日", "初回治験薬投与日", "スクリーニング日", "ランダム化日"], answer: 1, explanation: "RFSTDTCはReference Start Date/Timeで、通常は初回治験薬投与日です。同意取得日はDSに記録されます。" },
                { id: "q501_2", type: "choice", question: "VSドメインでCRFのWide Formatをどう変換しますか？", options: ["そのまま横持ちで保持", "Long Format（縦持ち）にTranspose", "別々のドメインに分割", "SUPPに格納"], answer: 1, explanation: "SDTMのFindingsクラスでは1行1検査項目のLong Formatに変換します。" },
                { id: "q501_3", type: "fill", question: "Study Day計算で、RFSTDTC当日のStudy Dayの値は？（数字で）", answer: "1", explanation: "SDTMのStudy Day計算ではDay 0は存在せず、RFSTDTC当日がDay 1になります。" },
                { id: "q501_4", type: "choice", question: "AEドメインのAETERMに何を入れますか？", options: ["MedDRA Preferred Term", "CRFのVerbatimそのまま", "英訳した医学用語", "LLT（Lowest Level Term）"], answer: 1, explanation: "AETERMにはCRFに記録されたVerbatim（原語）をそのまま保持します。MedDRAコードはAEDECODに入ります。" },
                { id: "q501_5", type: "choice", question: "LBドメインで血糖値をmg/dLからmmol/Lに変換する場合、結果はどの変数に格納しますか？", options: ["LBORRES", "LBSTRESC / LBSTRESN", "LBNRIND", "LBORNRLO"], answer: 1, explanation: "標準単位への変換結果はLBSTRESC（文字）/ LBSTRESN（数値）に格納します。LBORRESには原データを保持します。" },
                { id: "q501_6", type: "choice", question: "RFSTDTCが2024-01-15の場合、2024-01-10のStudy Dayは？", options: ["-4", "-5", "-6", "0"], answer: 1, explanation: "投与前のStudy Day = 日付 - RFSTDTC = 2024-01-10 - 2024-01-15 = -5。Day 0は存在しないため、マイナスの日はそのまま計算します。" }
            ]
        },
        {
            id: 502,
            title: "ドキュメント総合演習",
            duration: "40分",
            content: `
<h2>模擬試験 ABC-001 のドキュメント作成演習</h2>
<p>前のモジュールでマッピングしたデータに対して、規制当局への提出に必要な<strong>4種類のドキュメント</strong>を作成する演習を行います。</p>

<table>
<thead>
<tr><th>演習</th><th>ドキュメント</th><th>概要</th></tr>
</thead>
<tbody>
<tr><td>演習1</td><td>SDTM Specification</td><td>データセット・変数の仕様書</td></tr>
<tr><td>演習2</td><td>aCRF (Annotated CRF)</td><td>CRFにSDTM変数をアノテーション</td></tr>
<tr><td>演習3</td><td>Define.xml</td><td>機械可読なメタデータ定義</td></tr>
<tr><td>演習4</td><td>SDRG (Reviewer's Guide)</td><td>審査員向けガイド文書</td></tr>
</tbody>
</table>

<h2>演習1: SDTM Specification作成</h2>

<h3>Specificationテンプレート構成</h3>
<p>SDTM Specificationは通常Excelで作成し、以下のシートで構成されます：</p>
<table>
<thead>
<tr><th>シート名</th><th>内容</th></tr>
</thead>
<tbody>
<tr><td><strong>Datasets</strong></td><td>全ドメインの一覧と説明</td></tr>
<tr><td><strong>Variables</strong></td><td>各ドメインの全変数定義</td></tr>
<tr><td><strong>Codelists</strong></td><td>使用するControlled Terminologyの一覧</td></tr>
<tr><td><strong>ValueLevel</strong></td><td>パラメータ別の変数定義（LB, VS等）</td></tr>
<tr><td><strong>Methods</strong></td><td>導出方法の詳細</td></tr>
<tr><td><strong>Comments</strong></td><td>補足コメント</td></tr>
</tbody>
</table>

<h3>Datasetsシートの記入例</h3>
<table>
<thead>
<tr><th>Dataset</th><th>Description</th><th>Class</th><th>Structure</th><th>Purpose</th><th>Keys</th><th>Location</th></tr>
</thead>
<tbody>
<tr><td>DM</td><td>Demographics</td><td>Special Purpose</td><td>One record per subject</td><td>Tabulation</td><td>STUDYID, USUBJID</td><td>dm.xpt</td></tr>
<tr><td>AE</td><td>Adverse Events</td><td>Events</td><td>One record per event per subject</td><td>Tabulation</td><td>STUDYID, USUBJID, AESEQ</td><td>ae.xpt</td></tr>
<tr><td>VS</td><td>Vital Signs</td><td>Findings</td><td>One record per vital sign per visit per subject</td><td>Tabulation</td><td>STUDYID, USUBJID, VSTESTCD, VISITNUM, VSSEQ</td><td>vs.xpt</td></tr>
<tr><td>LB</td><td>Laboratory Results</td><td>Findings</td><td>One record per lab test per visit per subject</td><td>Tabulation</td><td>STUDYID, USUBJID, LBTESTCD, VISITNUM, LBSEQ</td><td>lb.xpt</td></tr>
</tbody>
</table>

<h3>Variablesシートの記入例（DMドメイン）</h3>
<table>
<thead>
<tr><th>Dataset</th><th>Variable</th><th>Label</th><th>Type</th><th>Length</th><th>Core</th><th>Origin</th><th>Codelist</th><th>Role</th></tr>
</thead>
<tbody>
<tr><td>DM</td><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>7</td><td>Req</td><td>Assigned</td><td></td><td>Identifier</td></tr>
<tr><td>DM</td><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>2</td><td>Req</td><td>Assigned</td><td></td><td>Identifier</td></tr>
<tr><td>DM</td><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>20</td><td>Req</td><td>Derived</td><td></td><td>Identifier</td></tr>
<tr><td>DM</td><td>SUBJID</td><td>Subject Identifier for the Study</td><td>Char</td><td>4</td><td>Req</td><td>CRF</td><td></td><td>Identifier</td></tr>
<tr><td>DM</td><td>RFSTDTC</td><td>Subject Reference Start Date/Time</td><td>Char</td><td>10</td><td>Req</td><td>Derived</td><td></td><td>Timing</td></tr>
<tr><td>DM</td><td>SEX</td><td>Sex</td><td>Char</td><td>1</td><td>Req</td><td>CRF</td><td>SEX</td><td>Qualifier</td></tr>
<tr><td>DM</td><td>AGE</td><td>Age</td><td>Num</td><td>8</td><td>Exp</td><td>Derived</td><td></td><td>Qualifier</td></tr>
<tr><td>DM</td><td>RACE</td><td>Race</td><td>Char</td><td>50</td><td>Exp</td><td>CRF</td><td>RACE</td><td>Qualifier</td></tr>
<tr><td>DM</td><td>ARMCD</td><td>Planned Arm Code</td><td>Char</td><td>8</td><td>Req</td><td>Derived</td><td></td><td>Qualifier</td></tr>
<tr><td>DM</td><td>ARM</td><td>Description of Planned Arm</td><td>Char</td><td>50</td><td>Req</td><td>Derived</td><td></td><td>Qualifier</td></tr>
</tbody>
</table>

<h3>Variablesシートの記入例（AEドメイン）</h3>
<table>
<thead>
<tr><th>Dataset</th><th>Variable</th><th>Label</th><th>Type</th><th>Length</th><th>Core</th><th>Origin</th><th>Codelist</th><th>Role</th></tr>
</thead>
<tbody>
<tr><td>AE</td><td>STUDYID</td><td>Study Identifier</td><td>Char</td><td>7</td><td>Req</td><td>Assigned</td><td></td><td>Identifier</td></tr>
<tr><td>AE</td><td>DOMAIN</td><td>Domain Abbreviation</td><td>Char</td><td>2</td><td>Req</td><td>Assigned</td><td></td><td>Identifier</td></tr>
<tr><td>AE</td><td>USUBJID</td><td>Unique Subject Identifier</td><td>Char</td><td>20</td><td>Req</td><td>Derived</td><td></td><td>Identifier</td></tr>
<tr><td>AE</td><td>AESEQ</td><td>Sequence Number</td><td>Num</td><td>8</td><td>Req</td><td>Derived</td><td></td><td>Identifier</td></tr>
<tr><td>AE</td><td>AETERM</td><td>Reported Term for the Adverse Event</td><td>Char</td><td>200</td><td>Req</td><td>CRF</td><td></td><td>Topic</td></tr>
<tr><td>AE</td><td>AEDECOD</td><td>Dictionary-Derived Term</td><td>Char</td><td>200</td><td>Req</td><td>Derived</td><td></td><td>Synonym</td></tr>
<tr><td>AE</td><td>AEBODSYS</td><td>Body System or Organ Class</td><td>Char</td><td>200</td><td>Req</td><td>Derived</td><td></td><td>Grouping</td></tr>
<tr><td>AE</td><td>AESEV</td><td>Severity/Intensity</td><td>Char</td><td>10</td><td>Exp</td><td>CRF</td><td>AESEV</td><td>Qualifier</td></tr>
<tr><td>AE</td><td>AESER</td><td>Serious Event</td><td>Char</td><td>1</td><td>Req</td><td>CRF</td><td>NY</td><td>Qualifier</td></tr>
<tr><td>AE</td><td>AESTDTC</td><td>Start Date/Time of Adverse Event</td><td>Char</td><td>10</td><td>Exp</td><td>CRF</td><td></td><td>Timing</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">💡 Origin（出所）の分類</div>
<strong>CRF</strong>：CRFから直接取得した値<br>
<strong>Derived</strong>：計算・導出した値（例：AGE, USUBJID, --DY）<br>
<strong>Assigned</strong>：プログラムで固定値を割り当て（例：STUDYID, DOMAIN）<br>
<strong>Protocol</strong>：プロトコルで決定された値<br>
<strong>eDT</strong>：外部データソースから取得
</div>

<h2>演習2: aCRF（Annotated CRF）作成</h2>

<h3>aCRFとは</h3>
<p>aCRF（annotated Case Report Form）は、<strong>CRFの各フィールドがSDTMのどの変数にマッピングされるか</strong>を示したPDFドキュメントです。</p>

<h3>Mock CRFページ（人口統計学的情報）</h3>
<div class="code-block"><div class="code-block-header"><span class="code-lang">CRF</span></div><pre><code>┌─────────────────────────────────────────────────────┐
│  ABC-001  DEMOGRAPHICS                    Page 1/1  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Subject Number: [________]                         │
│                                                     │
│  Date of Birth:  [____/____/____]                   │
│                   YYYY  MM   DD                     │
│                                                     │
│  Sex:  [ ] Male   [ ] Female                        │
│                                                     │
│  Race: [ ] Asian                                    │
│        [ ] White                                    │
│        [ ] Black or African American                │
│        [ ] Other: _______________                   │
│                                                     │
│  Date of Informed Consent: [____/____/____]         │
│                             YYYY  MM   DD           │
│                                                     │
└─────────────────────────────────────────────────────┘</code></pre></div>

<h3>aCRFアノテーション例</h3>
<p>各CRFフィールドに、対応するSDTMドメインと変数名を注釈として追加します：</p>

<table>
<thead>
<tr><th>CRFフィールド</th><th>aCRFアノテーション</th><th>備考</th></tr>
</thead>
<tbody>
<tr><td>Subject Number</td><td><strong>DM.SUBJID</strong></td><td>USUBJIDの構成要素</td></tr>
<tr><td>Date of Birth</td><td><strong>DM.BRTHDTC</strong></td><td>AGEの算出に使用</td></tr>
<tr><td>Sex</td><td><strong>DM.SEX</strong></td><td>CT: M=Male, F=Female</td></tr>
<tr><td>Race</td><td><strong>DM.RACE</strong></td><td>CT: ASIAN, WHITE等</td></tr>
<tr><td>Date of Informed Consent</td><td><strong>DS.DSSTDTC</strong> where DSTERM="INFORMED CONSENT OBTAINED"</td><td>DMではなくDSドメイン</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ aCRF作成の注意点</div>
・全てのCRFフィールドにアノテーションが必要（マッピング対象外は "Not Submitted" と記載）<br>
・1つのCRFフィールドが複数のSDTM変数にマッピングされる場合もある<br>
・SUPPドメインに格納する場合は "SUPPDM.QVAL where QNAM=xxx" と記載<br>
・アノテーションは通常、PDFのコメント機能またはテキストボックスで追加<br>
・ページヘッダー/フッターの Visit情報には "xx.VISIT / xx.VISITNUM" と記載
</div>

<h2>演習3: Define.xml作成</h2>

<h3>SpecificationとDefine.xmlの関係</h3>
<p>Define.xmlは、SDTM Specificationの内容を<strong>CDISC Define-XML標準</strong>に準拠したXMLファイルとして表現したものです。</p>

<table>
<thead>
<tr><th>Specification要素</th><th>Define.xml要素</th></tr>
</thead>
<tbody>
<tr><td>Datasets一覧</td><td>&lt;ItemGroupDef&gt;</td></tr>
<tr><td>Variables定義</td><td>&lt;ItemDef&gt; / &lt;ItemRef&gt;</td></tr>
<tr><td>Codelists</td><td>&lt;CodeList&gt;</td></tr>
<tr><td>ValueLevel</td><td>&lt;ValueListDef&gt;</td></tr>
<tr><td>Methods</td><td>&lt;MethodDef&gt;</td></tr>
<tr><td>Comments</td><td>&lt;def:CommentDef&gt;</td></tr>
</tbody>
</table>

<h3>Define.xml XMLの構造例</h3>
<div class="code-block"><div class="code-block-header"><span class="code-lang">XML</span></div><pre><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;?xml-stylesheet type="text/xsl" href="define2-0-0.xsl"?&gt;
&lt;ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     xmlns:def="http://www.cdisc.org/ns/def/v2.1"
     FileType="Snapshot"
     FileOID="DEF.ABC-001.SDTM"&gt;
  &lt;Study OID="STUDY.ABC-001"&gt;
    &lt;MetaDataVersion OID="MDV.ABC-001.SDTM.1"
                     Name="Study ABC-001 SDTM"
                     def:DefineVersion="2.1.7"
                     def:StandardName="SDTMIG"
                     def:StandardVersion="3.4"&gt;

      &lt;!-- Dataset Definition: DM --&gt;
      &lt;ItemGroupDef OID="IG.DM"
                    Domain="DM"
                    Name="DM"
                    def:Label="Demographics"
                    def:Structure="One record per subject"
                    def:Class="Special Purpose"
                    def:ArchiveLocationID="LOC.DM"&gt;
        &lt;ItemRef ItemOID="IT.DM.STUDYID" OrderNumber="1"
                 Mandatory="Yes" Role="Identifier"/&gt;
        &lt;ItemRef ItemOID="IT.DM.DOMAIN" OrderNumber="2"
                 Mandatory="Yes" Role="Identifier"/&gt;
        &lt;ItemRef ItemOID="IT.DM.USUBJID" OrderNumber="3"
                 Mandatory="Yes" Role="Identifier"/&gt;
        &lt;!-- ... more ItemRefs ... --&gt;
      &lt;/ItemGroupDef&gt;

      &lt;!-- Variable Definition --&gt;
      &lt;ItemDef OID="IT.DM.STUDYID"
              Name="STUDYID"
              DataType="text"
              Length="7"
              def:Label="Study Identifier"&gt;
        &lt;def:Origin Type="Assigned"/&gt;
      &lt;/ItemDef&gt;

      &lt;ItemDef OID="IT.DM.SEX"
              Name="SEX"
              DataType="text"
              Length="1"
              def:Label="Sex"&gt;
        &lt;def:Origin Type="CRF"&gt;
          &lt;def:DocumentRef leafID="LF.blankcrf"&gt;
            &lt;def:PDFPageRef PageRefs="5" Type="PhysicalRef"/&gt;
          &lt;/def:DocumentRef&gt;
        &lt;/def:Origin&gt;
        &lt;CodeListRef CodeListOID="CL.SEX"/&gt;
      &lt;/ItemDef&gt;

      &lt;!-- Codelist Definition --&gt;
      &lt;CodeList OID="CL.SEX" Name="Sex"
               DataType="text"&gt;
        &lt;CodeListItem CodedValue="M"&gt;
          &lt;Decode&gt;&lt;TranslatedText&gt;Male&lt;/TranslatedText&gt;&lt;/Decode&gt;
        &lt;/CodeListItem&gt;
        &lt;CodeListItem CodedValue="F"&gt;
          &lt;Decode&gt;&lt;TranslatedText&gt;Female&lt;/TranslatedText&gt;&lt;/Decode&gt;
        &lt;/CodeListItem&gt;
      &lt;/CodeList&gt;

    &lt;/MetaDataVersion&gt;
  &lt;/Study&gt;
&lt;/ODM&gt;</code></pre></div>

<div class="info-box tip">
<div class="info-box-title">💡 Define.xml作成のツール</div>
Define.xmlは通常、手書きではなく専用ツールで生成します：<br>
・<strong>Pinnacle 21 Community</strong>：バリデーション + Define.xml生成<br>
・<strong>Formedix</strong>：Define.xml作成・管理<br>
・<strong>自社マクロ/Rパッケージ</strong>：Specificationから自動生成<br>
XSLスタイルシート（define2-0-0.xsl）を同梱すると、ブラウザでHTML表示可能です。
</div>

<h2>演習4: SDRG（Study Data Reviewer's Guide）作成</h2>

<h3>SDRGテンプレート構成</h3>
<p>SDRGはFDAのReviewerがデータを理解するためのガイドです。以下のセクションで構成されます：</p>

<table>
<thead>
<tr><th>セクション</th><th>内容</th><th>記載例（ABC-001）</th></tr>
</thead>
<tbody>
<tr><td><strong>1. Submission Overview</strong></td><td>申請の概要</td><td>Phase III, Type 2 Diabetes, 450 subjects, 10 sites</td></tr>
<tr><td><strong>2. Regulatory References</strong></td><td>使用した標準バージョン</td><td>SDTM IG 3.4, CT 2024-03-29, Define-XML 2.1</td></tr>
<tr><td><strong>3. Trial Design</strong></td><td>試験デザインの説明</td><td>3-arm parallel: Drug A 10mg / Drug A 20mg / Placebo, 24 weeks</td></tr>
<tr><td><strong>4. Subject Data Description</strong></td><td>全ドメインの説明</td><td>DM, AE, VS, LB, EX, DS, MH, CM等の概要</td></tr>
<tr><td><strong>5. Data Conformance</strong></td><td>バリデーション結果</td><td>P21 results: 0 errors, 5 warnings with explanations</td></tr>
<tr><td><strong>6. Issues Summary</strong></td><td>既知の問題と説明</td><td>Partial dates in AE, SUPPQUAL usage explanation</td></tr>
<tr><td><strong>7. Appendices</strong></td><td>補足資料</td><td>Split domain list, non-standard variables</td></tr>
</tbody>
</table>

<h3>SDRGセクション5: Data Conformance記載例</h3>
<div class="code-block"><div class="code-block-header"><span class="code-lang">SDRG Section 5</span></div><pre><code>5. DATA CONFORMANCE SUMMARY

Pinnacle 21 Enterprise version 4.0.0 was used for validation.
SDTM IG version: 3.4
CT version: 2024-03-29

Validation Results:
  Errors:   0
  Warnings: 5

Warning Explanations:

| Rule ID  | Domain | Message                    | Explanation                |
|----------|--------|----------------------------|----------------------------|
| SD0048   | AE     | AEENDTC is incomplete date | Ongoing AEs at study end   |
|          |        |                            | have no end date per       |
|          |        |                            | protocol design.           |
| SD1015   | LB     | Non-standard variable      | LBTOX added per sponsor    |
|          |        | found: LBTOX               | convention for toxicity    |
|          |        |                            | grading. See SUPPLB.       |
| SD0083   | VS     | Inconsistent VISITNUM      | Unscheduled visits use     |
|          |        |                            | decimal numbering (e.g.,   |
|          |        |                            | 2.1) per SDTM IG guidance. |</code></pre></div>

<div class="info-box warning">
<div class="info-box-title">⚠️ SDRGの重要ポイント</div>
・P21バリデーションで検出されたWarning/Errorには<strong>全て説明</strong>を記載<br>
・Non-standard変数やSUPP--を使用した場合は理由を明記<br>
・Split domainがある場合はファイル構成を記載<br>
・SDRGはPDF形式で提出（通常10〜30ページ程度）
</div>

<h2>完全性チェックリスト</h2>
<table>
<thead>
<tr><th>No.</th><th>チェック項目</th><th>ステータス</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>全てのドメインのXPTファイルが揃っているか</td><td>[ ]</td></tr>
<tr><td>2</td><td>Define.xmlが全ドメイン・変数を網羅しているか</td><td>[ ]</td></tr>
<tr><td>3</td><td>aCRFが全CRFページをカバーしているか</td><td>[ ]</td></tr>
<tr><td>4</td><td>aCRFのアノテーションがDefine.xmlと整合しているか</td><td>[ ]</td></tr>
<tr><td>5</td><td>SDRGに全てのP21 warning説明があるか</td><td>[ ]</td></tr>
<tr><td>6</td><td>Define.xmlのXSLスタイルシートが同梱されているか</td><td>[ ]</td></tr>
<tr><td>7</td><td>変数のLabelが40文字以内か</td><td>[ ]</td></tr>
<tr><td>8</td><td>Controlled Terminologyバージョンが統一されているか</td><td>[ ]</td></tr>
<tr><td>9</td><td>Trial Designドメイン（TA, TE, TV, TI, TS）が含まれているか</td><td>[ ]</td></tr>
<tr><td>10</td><td>SUPPドメインのRDOMAIN/IDVAR/IDVARVALが正しいか</td><td>[ ]</td></tr>
</tbody>
</table>
`,
            quiz: [
                { id: "q502_1", type: "choice", question: "SDTM Specificationに含まれないシートはどれですか？", options: ["Datasets", "Variables", "Codelists", "Statistical Analysis Plan"], answer: 3, explanation: "Statistical Analysis Plan（SAP）はADaM関連文書であり、SDTM Specificationには含まれません。" },
                { id: "q502_2", type: "choice", question: "aCRFでCRFの「同意取得日」フィールドのアノテーションとして正しいのは？", options: ["DM.RFSTDTC", "DM.DMDTC", "DS.DSSTDTC where DSTERM=INFORMED CONSENT OBTAINED", "AE.AESTDTC"], answer: 2, explanation: "同意取得日はDSドメインのDSSTDTCに格納されます。DMドメインではありません。" },
                { id: "q502_3", type: "choice", question: "Define.xmlでデータセットの定義に使うXML要素は？", options: ["&lt;ItemDef&gt;", "&lt;ItemGroupDef&gt;", "&lt;CodeList&gt;", "&lt;ValueListDef&gt;"], answer: 1, explanation: "<ItemGroupDef>がデータセット（ドメイン）の定義に使用されるXML要素です。" },
                { id: "q502_4", type: "choice", question: "SDRGのData Conformanceセクションで必ず記載すべきことは？", options: ["SASプログラムのソースコード", "P21バリデーションの全Warning/Errorの説明", "全被験者のリスト", "解析結果のサマリー"], answer: 1, explanation: "Data Conformanceセクションでは、P21バリデーションで検出された全てのWarning/Errorに対する説明を記載します。" },
                { id: "q502_5", type: "fill", question: "CRFにSDTM変数のアノテーションを付けた文書の略称は？", answer: "aCRF", explanation: "aCRF（annotated CRF）はCRFにSDTM変数をアノテーションした文書です。" },
                { id: "q502_6", type: "choice", question: "Define.xmlの変数定義で、変数がCRFから直接取得されたことを示すOrigin Typeは？", options: ["Assigned", "Derived", "CRF", "Protocol"], answer: 2, explanation: "Origin Type='CRF'はその変数の値がCRFから直接取得されたことを示します。" }
            ]
        },
        {
            id: 503,
            title: "FDA申請パッケージ",
            duration: "30分",
            content: `
<h2>eCTD（electronic Common Technical Document）構造</h2>
<p>医薬品の承認申請データは<strong>eCTD</strong>という国際標準の電子申請フォーマットで提出します。eCTDは5つのModuleで構成されます。</p>

<table>
<thead>
<tr><th>Module</th><th>名称</th><th>内容</th></tr>
</thead>
<tbody>
<tr><td><strong>Module 1</strong></td><td>Administrative Information</td><td>申請書・添付文書（地域固有）</td></tr>
<tr><td><strong>Module 2</strong></td><td>Summaries</td><td>品質・非臨床・臨床概括</td></tr>
<tr><td><strong>Module 3</strong></td><td>Quality</td><td>品質（CMC）データ</td></tr>
<tr><td><strong>Module 4</strong></td><td>Nonclinical Study Reports</td><td>非臨床試験報告書</td></tr>
<tr><td><strong>Module 5</strong></td><td>Clinical Study Reports</td><td>臨床試験報告書・データ</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">💡 SDTMデータの格納場所</div>
SDTMデータは<strong>Module 5</strong>内の<code>m5/datasets/</code>配下に格納されます。各試験のデータが試験番号別のフォルダに整理されます。
</div>

<h2>ファイル構成（m5/datasets/配下）</h2>

<h3>ディレクトリ構造</h3>
<div class="code-block"><div class="code-block-header"><span class="code-lang">Directory Structure</span></div><pre><code>m5/
└── datasets/
    └── study-abc-001/
        └── tabulations/
            └── sdtm/
                ├── dm.xpt
                ├── ae.xpt
                ├── vs.xpt
                ├── lb.xpt
                ├── ex.xpt
                ├── ds.xpt
                ├── mh.xpt
                ├── cm.xpt
                ├── sv.xpt
                ├── suppae.xpt
                ├── supplb.xpt
                ├── ta.xpt
                ├── te.xpt
                ├── tv.xpt
                ├── ti.xpt
                ├── ts.xpt
                ├── relrec.xpt
                ├── define.xml
                ├── define2-0-0.xsl
                └── blankcrf.pdf
        └── analysis/
            └── adam/
                ├── adsl.xpt
                ├── adae.xpt
                ├── advs.xpt
                ├── adlb.xpt
                ├── define.xml
                └── define2-0-0.xsl</code></pre></div>

<h3>提出ファイル一覧</h3>
<table>
<thead>
<tr><th>ファイル</th><th>内容</th><th>必須/任意</th></tr>
</thead>
<tbody>
<tr><td><strong>*.xpt</strong></td><td>SDTMデータセット（SAS V5 Transport）</td><td>必須</td></tr>
<tr><td><strong>define.xml</strong></td><td>データ定義メタデータ</td><td>必須</td></tr>
<tr><td><strong>define2-0-0.xsl</strong></td><td>Define.xml表示用スタイルシート</td><td>必須</td></tr>
<tr><td><strong>blankcrf.pdf</strong></td><td>annotated CRF</td><td>必須</td></tr>
<tr><td><strong>reviewers-guide.pdf</strong></td><td>SDRG（Reviewer's Guide）</td><td>強く推奨</td></tr>
</tbody>
</table>

<h2>ファイル命名規則とサイズ制限</h2>

<table>
<thead>
<tr><th>項目</th><th>規則</th></tr>
</thead>
<tbody>
<tr><td>ファイル名</td><td>小文字英数字、ドメイン名.xpt（例：dm.xpt, ae.xpt）</td></tr>
<tr><td>ファイル名の文字</td><td>英数字、ハイフン、アンダースコアのみ</td></tr>
<tr><td>パス長</td><td>eCTD内で最大230文字</td></tr>
<tr><td>データセットサイズ</td><td>個々のXPTファイル: <strong>最大5GB</strong></td></tr>
<tr><td>Split domain</td><td>5GBを超える場合、LBなどをSplit（lb1.xpt, lb2.xptなど）</td></tr>
</tbody>
</table>

<h2>XPT（SAS V5 Transport）の要件</h2>

<table>
<thead>
<tr><th>制約項目</th><th>制限値</th><th>備考</th></tr>
</thead>
<tbody>
<tr><td>変数名の長さ</td><td><strong>最大8文字</strong></td><td>英数字とアンダースコア</td></tr>
<tr><td>変数ラベルの長さ</td><td><strong>最大40文字</strong></td><td>英数字・記号</td></tr>
<tr><td>データセット名の長さ</td><td><strong>最大8文字</strong></td><td>ドメインコードそのまま</td></tr>
<tr><td>データセットラベルの長さ</td><td><strong>最大40文字</strong></td><td>英語記述</td></tr>
<tr><td>文字変数の最大長</td><td><strong>200バイト</strong></td><td>実データ長に合わせる</td></tr>
<tr><td>数値精度</td><td>8バイト浮動小数点</td><td>SAS numeric</td></tr>
<tr><td>エンコーディング</td><td>ASCII</td><td>日本語不可</td></tr>
</tbody>
</table>

<div class="info-box warning">
<div class="info-box-title">⚠️ XPT制約への対応</div>
・変数名が8文字を超えるとXPT出力時にエラー → SDTM変数名はもともと8文字以内で設計<br>
・ラベルが40文字を超えるとtruncateされる → Define.xmlでフルラベルを定義<br>
・文字変数長は実際のデータ最大長に設定（不必要に200にしない）<br>
・日本語文字はXPTに格納できない → AETERMの日本語Verbatimは英訳が必要
</div>

<h2>提出前バリデーションチェックリスト</h2>

<table>
<thead>
<tr><th>No.</th><th>チェック項目</th><th>ツール</th><th>判定基準</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>全必須ドメイン（DM, AE, DS, EX等）が含まれているか</td><td>手動確認</td><td>プロトコルに応じた全ドメイン</td></tr>
<tr><td>2</td><td>P21バリデーションでErrorが0件か</td><td>Pinnacle 21</td><td>Error = 0</td></tr>
<tr><td>3</td><td>P21 WarningにSDRGで説明があるか</td><td>SDRG確認</td><td>全Warning説明済み</td></tr>
<tr><td>4</td><td>Define.xmlがバリデーションに合格するか</td><td>Pinnacle 21</td><td>Schema valid</td></tr>
<tr><td>5</td><td>Define.xmlのXSLでブラウザ表示できるか</td><td>ブラウザ</td><td>正常に表示</td></tr>
<tr><td>6</td><td>aCRFが全CRFページを網羅しているか</td><td>手動確認</td><td>欠落ページなし</td></tr>
<tr><td>7</td><td>XPTファイルが5GB以下か</td><td>ファイルサイズ</td><td>各ファイル5GB以下</td></tr>
<tr><td>8</td><td>変数名が8文字以内か</td><td>P21</td><td>全変数準拠</td></tr>
<tr><td>9</td><td>Trial Designドメイン（TA, TE, TV, TI, TS）が含まれているか</td><td>手動確認</td><td>全5ドメイン存在</td></tr>
<tr><td>10</td><td>USUBJID形式が全ドメインで一貫しているか</td><td>P21 / クロスチェック</td><td>DMのUSUBJIDと一致</td></tr>
</tbody>
</table>

<h2>PMDA（日本）固有の要件</h2>

<h3>FDAとPMDAの主な違い</h3>
<table>
<thead>
<tr><th>項目</th><th>FDA</th><th>PMDA</th></tr>
</thead>
<tbody>
<tr><td>義務化時期</td><td>2016年12月〜</td><td>2020年4月〜</td></tr>
<tr><td>対象</td><td>NDA/BLA</td><td>新医薬品の承認申請</td></tr>
<tr><td>eCTD</td><td>必須</td><td>必須（ゲートウェイ申請）</td></tr>
<tr><td>SDTM IGバージョン</td><td>FDA Data Standards Catalog参照</td><td>PMDA通知で指定</td></tr>
<tr><td>日本語データ</td><td>英語のみ</td><td>日本語データも別途提出可能（SUPPQUAL等）</td></tr>
<tr><td>バリデーションツール</td><td>Pinnacle 21</td><td>Pinnacle 21（PMDAルール対応版）</td></tr>
<tr><td>Reviewer's Guide</td><td>SDRG</td><td>SDRG + 日本語補足資料</td></tr>
<tr><td>データ確認依頼</td><td>事前相談（Pre-NDA meeting）</td><td>データ確認相談（事前面談）</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="info-box-title">💡 PMDA対応のポイント</div>
・PMDAはFDAと同じCDISC標準を使用しますが、<strong>日本固有の追加要件</strong>があります<br>
・日本語のVerbatim Term（AETERMなど）は英訳してXPTに格納し、原語は補足資料で提出<br>
・PMDAの<strong>「電子データ提出に関する技術的ガイド」</strong>を必ず参照してください<br>
・PMDA固有のバリデーションルールがPinnacle 21に追加されています
</div>

<h2>よくある提出リジェクト理由</h2>

<table>
<thead>
<tr><th>No.</th><th>リジェクト理由</th><th>対策</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>P21バリデーションでErrorが残っている</td><td>提出前に全Error解消を確認</td></tr>
<tr><td>2</td><td>Define.xmlが不完全（変数定義が欠落）</td><td>全ドメイン・全変数の定義を確認</td></tr>
<tr><td>3</td><td>aCRFのアノテーションが不足</td><td>全CRFフィールドのアノテーション完了を確認</td></tr>
<tr><td>4</td><td>Trial Designドメインが欠落</td><td>TA, TE, TV, TI, TSの5ドメインを必ず含める</td></tr>
<tr><td>5</td><td>USUBJIDの不整合（ドメイン間で形式が異なる）</td><td>全ドメインで統一されたUSUBJID生成ロジックを使用</td></tr>
<tr><td>6</td><td>XPTファイルが破損している</td><td>生成後にPinnacle 21で読み込み確認</td></tr>
<tr><td>7</td><td>SDRGにP21 Warningの説明がない</td><td>全Warning/Noticeに説明を記載</td></tr>
<tr><td>8</td><td>Controlled Terminologyバージョンが不適切</td><td>FDA Data Standards Catalogで推奨バージョンを確認</td></tr>
</tbody>
</table>

<h2>SDTMプロフェッショナルのキャリアパス</h2>

<table>
<thead>
<tr><th>レベル</th><th>役割</th><th>経験年数（目安）</th><th>主な業務</th></tr>
</thead>
<tbody>
<tr><td><strong>Entry</strong></td><td>SDTM Programmer</td><td>0〜2年</td><td>個別ドメインのマッピングプログラム作成</td></tr>
<tr><td><strong>Mid</strong></td><td>Senior SDTM Programmer</td><td>2〜5年</td><td>複数ドメイン担当、Spec作成、後輩指導</td></tr>
<tr><td><strong>Senior</strong></td><td>Lead Standards Programmer</td><td>5〜8年</td><td>試験全体のSDTM設計、Define.xml管理、P21対応</td></tr>
<tr><td><strong>Expert</strong></td><td>CDISC Standards Manager</td><td>8年〜</td><td>全社標準策定、規制当局対応、CDISC活動参加</td></tr>
</tbody>
</table>

<h3>キャリアアップに有効なスキル・資格</h3>
<table>
<thead>
<tr><th>スキル/資格</th><th>内容</th></tr>
</thead>
<tbody>
<tr><td><strong>SAS Base/Advanced認定</strong></td><td>SASプログラミングの基盤スキル証明</td></tr>
<tr><td><strong>CDISC SDTM Certificate</strong></td><td>CDISC公式のSDTM認定プログラム</td></tr>
<tr><td><strong>R / Python</strong></td><td>近年はオープンソース言語の需要が増加</td></tr>
<tr><td><strong>Domain知識</strong></td><td>臨床試験・薬事規制の理解</td></tr>
<tr><td><strong>英語力</strong></td><td>グローバル試験、FDA対応に必須</td></tr>
</tbody>
</table>

<h2>学習リソース</h2>

<table>
<thead>
<tr><th>リソース</th><th>URL / 概要</th><th>費用</th></tr>
</thead>
<tbody>
<tr><td><strong>CDISC Website</strong></td><td>https://www.cdisc.org/ - 標準文書のダウンロード、ニュース</td><td>無料（会員登録推奨）</td></tr>
<tr><td><strong>CDISC e-Learning</strong></td><td>CDISC公式のオンラインコース（SDTM, ADaM, Define-XML等）</td><td>有料（コース別）</td></tr>
<tr><td><strong>PharmaSUG</strong></td><td>Pharmaceutical SAS Users Group - 年次カンファレンス、論文多数</td><td>カンファレンス参加は有料、論文は無料</td></tr>
<tr><td><strong>CDISC Wiki</strong></td><td>CDISC標準の詳細な解説・FAQ</td><td>無料</td></tr>
<tr><td><strong>Pinnacle 21 Community</strong></td><td>無料のバリデーションツール、学習にも最適</td><td>無料</td></tr>
<tr><td><strong>FDA Technical Conformance Guide</strong></td><td>FDAのデータ提出技術要件の公式ガイド</td><td>無料</td></tr>
<tr><td><strong>PMDA 電子データ提出ガイド</strong></td><td>PMDAの技術的ガイド文書</td><td>無料</td></tr>
</tbody>
</table>

<div class="info-box success">
<div class="info-box-title">✅ SDTM Academyコース修了</div>
全6レベル・35モジュールの学習が完了しました。SDTMの基礎概念から実践的なマッピング、ドキュメント作成、規制当局への提出、さらにアドバンストドメインまで体系的に学ぶことができました。<br><br>
<strong>次のステップ：</strong><br>
・実際のデータでマッピングを練習する<br>
・Pinnacle 21 Communityでバリデーションを試す<br>
・CDISC e-Learningで公式認定を取得する<br>
・PharmaSUGの論文を読んで最新トレンドをキャッチアップする<br>
・ADaM（Analysis Data Model）の学習に進む
</div>
`,
            quiz: [
                { id: "q503_1", type: "choice", question: "eCTDでSDTMデータが格納されるModuleは？", options: ["Module 2", "Module 3", "Module 4", "Module 5"], answer: 3, explanation: "SDTMデータはModule 5（Clinical Study Reports）のm5/datasets/配下に格納されます。" },
                { id: "q503_2", type: "choice", question: "XPTファイルの変数名の最大文字数は？", options: ["4文字", "8文字", "16文字", "32文字"], answer: 1, explanation: "SAS V5 Transportフォーマットの制約で、変数名は最大8文字です。" },
                { id: "q503_3", type: "choice", question: "個々のXPTファイルのサイズ上限は？", options: ["1GB", "2GB", "5GB", "10GB"], answer: 2, explanation: "個々のXPTファイルの最大サイズは5GBです。超える場合はドメインをSplitします。" },
                { id: "q503_4", type: "fill", question: "XPTファイルの変数ラベルの最大文字数は？（数字で）", answer: "40", explanation: "SAS V5 Transportフォーマットでは変数ラベルは最大40文字です。" },
                { id: "q503_5", type: "choice", question: "PMDAがCDISC標準によるデータ提出を原則化したのはいつから？", options: ["2016年12月", "2018年4月", "2020年4月", "2022年4月"], answer: 2, explanation: "PMDAは2020年4月以降、新医薬品の承認申請にCDISC標準のデータ提出を原則求めています。" },
                { id: "q503_6", type: "choice", question: "SDTMデータ提出パッケージに必須でないファイルはどれですか？", options: ["define.xml", "blankcrf.pdf", "reviewers-guide.pdf", "*.xpt"], answer: 2, explanation: "reviewers-guide.pdf（SDRG）は強く推奨されていますが、define.xml、blankcrf.pdf、XPTファイルは必須です。" }
            ]
        }
    ]
};
