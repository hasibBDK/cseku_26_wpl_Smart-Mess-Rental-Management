from io import BytesIO
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\Hasibur Rahaman\Downloads\report.pdf")
OUTPUT = ROOT / "Bayesian_Classifier_Assignment_Polished.docx"
NAVY = "17365D"
BLUE = "2F75B5"
LIGHT = "EAF2F8"
GRAY = "666666"


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def add_page_number(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = paragraph.add_run()
    fld_char1 = OxmlElement("w:fldChar")
    fld_char1.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = "PAGE"
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "end")
    run._r.extend([fld_char1, instr, fld_char2])


def add_heading(doc, text, level=1):
    p = doc.add_heading(text, level=level)
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(6)
    return p


def add_body(doc, text):
    p = doc.add_paragraph(text)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(7)
    p.paragraph_format.line_spacing = 1.15
    return p


def add_bullets(doc, items):
    for item in items:
        p = doc.add_paragraph(item, style="List Bullet")
        p.paragraph_format.space_after = Pt(3)


def add_table(doc, headers, rows, widths=None):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = table.rows[0]
    set_repeat_table_header(hdr)
    for i, heading in enumerate(headers):
        cell = hdr.cells[i]
        set_cell_shading(cell, NAVY)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(str(heading))
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
    for r_i, row in enumerate(rows):
        cells = table.add_row().cells
        for i, value in enumerate(row):
            cells[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            if r_i % 2 == 1:
                set_cell_shading(cells[i], "F4F7FA")
            p = cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if i == 0 else WD_ALIGN_PARAGRAPH.CENTER
            p.add_run(str(value))
    if widths:
        for row in table.rows:
            for i, width in enumerate(widths):
                row.cells[i].width = Inches(width)
    doc.add_paragraph()
    return table


def add_figure(doc, image_data, caption, width=6.2):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(BytesIO(image_data), width=Inches(width))
    cap = doc.add_paragraph(caption)
    cap.style = "Caption"
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap.paragraph_format.space_after = Pt(8)


def add_formula(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(7)
    r = p.add_run(text)
    r.font.name = "Cambria Math"
    r.font.size = Pt(11)


doc = Document()
section = doc.sections[0]
section.top_margin = Inches(0.75)
section.bottom_margin = Inches(0.7)
section.left_margin = Inches(0.85)
section.right_margin = Inches(0.75)

styles = doc.styles
styles["Normal"].font.name = "Aptos"
styles["Normal"].font.size = Pt(10.5)
styles["Normal"].paragraph_format.space_after = Pt(6)
for name, size, color in [("Title", 25, NAVY), ("Heading 1", 16, NAVY), ("Heading 2", 12, BLUE)]:
    styles[name].font.name = "Aptos Display"
    styles[name].font.size = Pt(size)
    styles[name].font.color.rgb = RGBColor.from_string(color)
    styles[name].font.bold = True

# Cover page
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(42)
r = p.add_run("KHULNA UNIVERSITY")
r.bold = True
r.font.size = Pt(17)
r.font.color.rgb = RGBColor.from_string(NAVY)
p = doc.add_paragraph("Computer Science and Engineering Discipline")
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.runs[0].font.size = Pt(12)
p.runs[0].font.color.rgb = RGBColor.from_string(GRAY)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(62)
r = p.add_run("BAYESIAN MINIMUM-ERROR-RATE\nCLASSIFIER")
r.bold = True
r.font.size = Pt(25)
r.font.color.rgb = RGBColor.from_string(NAVY)
p = doc.add_paragraph("Implementation, Evaluation, and Comparative Study")
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.runs[0].italic = True
p.runs[0].font.size = Pt(13)
p.runs[0].font.color.rgb = RGBColor.from_string(BLUE)

p = doc.add_paragraph("Pattern Recognition Laboratory\nCourse Code: 0714 02 CSE 4222\nAssignment 1")
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(24)
p.paragraph_format.line_spacing = 1.25

t = doc.add_table(rows=1, cols=2)
t.alignment = WD_TABLE_ALIGNMENT.CENTER
t.autofit = False
left, right = t.rows[0].cells
for c in (left, right):
    set_cell_shading(c, LIGHT)
    c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
left.text = "SUBMITTED BY\n\nHasibur Rahaman\nStudent ID: 220227\nCSE Discipline\nKhulna University"
right.text = "SUBMITTED TO\n\nRafizul Haque\nProfessor\nCSE Discipline\nKhulna University"
for cell in (left, right):
    for idx, para in enumerate(cell.paragraphs):
        para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in para.runs:
            run.font.size = Pt(10.5)
            if idx == 0:
                run.bold = True
                run.font.color.rgb = RGBColor.from_string(NAVY)

doc.add_page_break()

add_heading(doc, "Contents", 1)
contents = [
    "1. Introduction and Theoretical Background",
    "2. Classifier Design and Implementation",
    "3. Synthetic 2D Experiment",
    "4. Iris Dataset Evaluation",
    "5. Comparison with scikit-learn",
    "6. Effect of Training Size",
    "7. Conclusion and Reproducibility",
]
for item in contents:
    p = doc.add_paragraph(item)
    p.paragraph_format.left_indent = Inches(0.2)
    p.paragraph_format.space_after = Pt(5)

add_heading(doc, "Report Overview", 1)
add_body(doc, "This report presents a from-scratch implementation of a Bayesian minimum-error-rate classifier for multivariate Gaussian data. Three covariance assumptions are studied, first on a controlled synthetic dataset and then on the Iris dataset. The experiments focus on decision-boundary geometry, classification performance, comparison with established implementations, and the effect of limited training data on covariance estimation.")

add_heading(doc, "1. Introduction and Theoretical Background", 1)
add_heading(doc, "1.1 Objective", 2)
add_body(doc, "The main objective was to implement and examine a Bayes minimum-error-rate classifier using maximum-likelihood estimates of the class parameters. The work covers the three standard covariance cases required in the assignment and connects each assumption with the shape of the resulting decision boundary.")
add_heading(doc, "1.2 Bayesian decision rule", 2)
add_body(doc, "For a feature vector x and a set of classes ωᵢ, the Bayes classifier assigns x to the class with the largest posterior probability P(ωᵢ | x). Since the evidence p(x) is common to every class, classification can be based on the following discriminant function:")
add_formula(doc, "gᵢ(x) = ln p(x | ωᵢ) + ln P(ωᵢ)")
add_body(doc, "For a d-dimensional Gaussian class model, the class-conditional density is determined by the mean vector μᵢ and covariance matrix Σᵢ. After removing the class-independent term, the implemented score becomes:")
add_formula(doc, "gᵢ(x) = −½(x − μᵢ)ᵀΣᵢ⁻¹(x − μᵢ) − ½ ln|Σᵢ| + ln P(ωᵢ)")
add_body(doc, "For nᵢ observations in class i, the mean, covariance, and class prior are estimated by maximum likelihood. The covariance estimate therefore uses nᵢ, rather than nᵢ − 1, in the denominator.")
add_heading(doc, "1.3 Covariance cases", 2)
add_bullets(doc, [
    "Case 1 — shared spherical covariance (Σᵢ = σ²I): classification is based on scaled Euclidean distance, and pairwise boundaries are linear.",
    "Case 2 — shared full covariance (Σᵢ = Σ): feature correlation is retained, but the common quadratic term cancels, so the boundaries remain linear.",
    "Case 3 — class-specific full covariance: each class has its own shape and orientation. The remaining quadratic terms usually produce curved boundaries.",
])
add_body(doc, "A fixed random seed of 42 was used throughout the experiments so that the reported results can be reproduced.")

add_heading(doc, "2. Classifier Design and Implementation", 1)
add_heading(doc, "2.1 Structure of the implementation", 2)
add_body(doc, "The custom BayesianClassifier supports all three covariance cases. NumPy is used to estimate the class priors, class means, and maximum-likelihood covariance matrices. The class provides discriminant scores, predicted labels, and normalized posterior probabilities obtained through a numerically stable softmax calculation.")
add_heading(doc, "2.2 Covariance construction", 2)
add_body(doc, "Let Sᵢ denote the within-class scatter matrix. The pooled maximum-likelihood covariance is obtained by adding the scatter matrices and dividing by the total number of training observations. Case 1 uses the average pooled variance multiplied by the identity matrix; Case 2 uses the pooled covariance directly; and Case 3 uses a separate maximum-likelihood covariance for each class.")
add_formula(doc, "Σₚₒₒₗ = (Σᵢ Sᵢ) / n")
add_heading(doc, "2.3 Numerical stability", 2)
add_body(doc, "The discriminant is evaluated with numpy.linalg.solve instead of explicitly computing a matrix inverse. Log-determinants are obtained with slogdet. A small diagonal term, 10⁻⁶I, is added only to the covariance used for scoring. The unregularized maximum-likelihood matrices are kept separately so that their condition numbers still reveal small-sample instability.")
add_heading(doc, "2.4 Implementation procedure", 2)
for step in [
    "Identify the classes and estimate their prior probabilities from class frequencies.",
    "Compute the mean vector and raw maximum-likelihood covariance for each class.",
    "Construct the covariance model required by Case 1, Case 2, or Case 3.",
    "Evaluate every class discriminant for each test observation.",
    "Return the class associated with the largest score.",
]:
    doc.add_paragraph(step, style="List Number")
add_body(doc, "The experiments were run with Python 3.13.5, NumPy 2.3.5, pandas 2.2.3, Matplotlib 3.10.8, and scikit-learn 1.8.0. Scikit-learn classifiers were used only in the comparison experiment.")

reader = PdfReader(str(SOURCE))
fig1 = reader.pages[2].images[0].data
fig2 = reader.pages[3].images[0].data
fig3 = reader.pages[4].images[0].data
fig4 = reader.pages[6].images[0].data
fig5 = reader.pages[6].images[1].data

add_heading(doc, "3. Synthetic 2D Experiment", 1)
add_body(doc, "A three-class, two-dimensional Gaussian dataset was generated with 150 samples per class and seed 42. Each custom classifier was trained on the complete synthetic dataset. Training accuracy is reported here as a direct implementation check rather than as an estimate of generalization performance.")
add_table(doc, ["Model", "Training Accuracy"], [("Case 1", "0.9222"), ("Case 2", "0.9200"), ("Case 3", "0.9489")], [3.4, 2.0])
add_figure(doc, fig1, "Figure 1. Decision regions for the three covariance cases on the synthetic Gaussian dataset.")
add_heading(doc, "Discussion", 2)
add_body(doc, "Case 1 produces straight boundaries because all classes share a spherical covariance. Case 2 changes the direction and scale of the distance contours by allowing correlation, although its boundaries are still linear because the covariance is shared. In Case 3, separate covariance matrices leave unequal quadratic terms in the pairwise discriminants, which explains the visibly curved boundaries. Its higher training accuracy is also reasonable because the synthetic classes were generated with different covariance structures.")

add_heading(doc, "4. Iris Dataset Evaluation", 1)
add_heading(doc, "4.1 Four-feature evaluation", 2)
add_body(doc, "The Iris dataset was divided into a 70% training set and a 30% test set using a stratified split with seed 42. A Case 3 classifier was trained on all four features. It correctly classified 44 of the 45 test observations, giving an accuracy of 0.9778.")
add_table(doc, ["Class", "Precision", "Recall", "F1-score", "Support"], [
    ("Setosa", "1.0000", "1.0000", "1.0000", "15"),
    ("Versicolor", "0.9375", "1.0000", "0.9677", "15"),
    ("Virginica", "1.0000", "0.9333", "0.9655", "15"),
], [2.1, 1.1, 1.1, 1.1, 0.9])
add_figure(doc, fig2, "Figure 2. Confusion matrix for the four-feature Case 3 Iris classifier.", width=3.9)
add_body(doc, "All Setosa and Versicolor samples were classified correctly. The only error was a Virginica observation assigned to Versicolor. This is consistent with the usual geometry of the dataset: Setosa is strongly separated by its petal measurements, whereas Versicolor and Virginica overlap near their shared boundary. The error also explains Versicolor's slightly lower precision and Virginica's lower recall.")
add_heading(doc, "4.2 Two-feature visualization", 2)
add_body(doc, "The experiment was repeated with petal length and petal width so that the decision regions could be viewed directly. The same stratified split and random seed were retained. The two-feature Case 3 model achieved a test accuracy of 0.9333.")
add_figure(doc, fig3, "Figure 3. Case 3 decision regions using petal length and petal width; test samples are marked with crosses.")
add_body(doc, "Petal length and width retain most of the class-separation information, particularly for Setosa. The decrease from 0.9778 to 0.9333 suggests that the sepal measurements still contribute useful evidence for observations near the Versicolor–Virginica overlap. The curved upper boundary is the expected result of fitting a different covariance matrix to each class.")

add_heading(doc, "5. Comparison with scikit-learn", 1)
add_body(doc, "All classifiers were evaluated on the same 70/30 stratified Iris split. This keeps the comparison focused on modeling assumptions instead of differences in the sampled train and test sets.")
add_table(doc, ["Classifier", "Test Accuracy"], [
    ("Custom Case 1", "0.9111"), ("Custom Case 2", "0.9778"),
    ("Custom Case 3", "0.9778"), ("GaussianNB", "0.9111"),
    ("Quadratic Discriminant Analysis", "0.9778"),
], [4.2, 1.5])
add_body(doc, "Case 1 is the most restrictive custom model because it ignores feature correlation and class-specific spread. Case 2 performs better after allowing a shared full covariance. Case 3 adds separate class covariances and reaches the same test accuracy on this split, although an equal accuracy does not necessarily mean that the two decision functions are identical.")
add_body(doc, "GaussianNB assumes conditional independence, which corresponds to a diagonal covariance matrix for each class. The custom Case 3 classifier retains off-diagonal correlations and performs better here (0.9778 compared with 0.9111). Quadratic Discriminant Analysis is the closest standard counterpart to Case 3; their matching accuracies provide a useful external check on the custom implementation. Minor numerical differences can still arise from covariance-estimation or regularization conventions.")

add_heading(doc, "6. Effect of Training Size", 1)
add_body(doc, "To examine sample-size sensitivity, the Iris training fraction was varied from 10% to 90% in steps of 10%. A stratified split with seed 42 was created at each fraction, and the Case 3 classifier was evaluated on the remaining observations.")
rows = [
    ("10%", 15, "0.8519", "412.4"), ("20%", 30, "0.9417", "374.3"),
    ("30%", 45, "0.9524", "173.7"), ("40%", 60, "0.9778", "99.1"),
    ("50%", 75, "0.9867", "46.6"), ("60%", 90, "0.9833", "44.9"),
    ("70%", 105, "0.9778", "38.0"), ("80%", 120, "1.0000", "36.4"),
    ("90%", 135, "1.0000", "46.9"),
]
add_table(doc, ["Training Fraction", "Training Samples", "Accuracy", "Maximum Condition No."], rows, [1.6, 1.6, 1.2, 2.0])
add_figure(doc, fig4, "Figure 4. Test accuracy as the training fraction increases.", width=5.8)
add_figure(doc, fig5, "Figure 5. Maximum condition number of the raw class covariance estimates.", width=5.8)
add_body(doc, "At the 10% setting, the model has roughly five observations per class for four features. That is very little information for estimating a full 4 × 4 covariance matrix, especially its off-diagonal elements. The resulting estimate is sensitive to small changes in the data, as indicated by the condition number of approximately 412 and the lower accuracy of 0.8519.")
add_body(doc, "As more training observations become available, the covariance estimates generally stabilize and accuracy rises into the 0.98–1.00 range. The sequence is not perfectly monotonic because each fraction changes both the fitted model and the composition of the test set. At 80% and 90%, the test set is small, so the measured accuracy also has greater sampling variability. The 10⁻⁶I scoring adjustment prevents numerical failures while leaving the raw condition-number analysis unchanged.")

add_heading(doc, "7. Conclusion and Reproducibility", 1)
add_body(doc, "The experiments show how covariance assumptions control both the flexibility and the geometry of Gaussian Bayesian classifiers. A shared spherical covariance is simple but restrictive. A shared full covariance accounts for feature correlation while retaining linear boundaries. Class-specific full covariances produce quadratic boundaries and gave the strongest results in the main Iris experiment, but they were also the most sensitive when only a few training samples were available.")
add_bullets(doc, [
    "The three custom cases produced the expected linear or quadratic decision-region geometry.",
    "The four-feature Case 3 classifier achieved 0.9778 test accuracy, with one error among 45 samples.",
    "The two-petal-feature model retained 0.9333 accuracy and clearly illustrated the quadratic regions.",
    "Custom Cases 2 and 3 and scikit-learn QDA each achieved 0.9778 on the fixed split.",
    "The training-size study exposed the instability of full covariance estimation when only a few observations are available per class.",
])
add_heading(doc, "Reproduction instructions", 2)
add_body(doc, "Extract the submitted ZIP file and run the following command from its root directory:")
add_formula(doc, "python bayes_classifier.py")
add_body(doc, "The script prints the reported metrics and creates an outputs directory containing the decision-region figures and CSV tables. The required packages are NumPy, pandas, Matplotlib, and scikit-learn. Exact package versions are listed in README.md.")

# Header/footer, applied to all non-cover pages (cover uses same section but a restrained header).
for sec in doc.sections:
    header = sec.header.paragraphs[0]
    header.text = "PATTERN RECOGNITION LABORATORY  |  BAYESIAN CLASSIFIER"
    header.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for run in header.runs:
        run.font.size = Pt(8)
        run.font.color.rgb = RGBColor.from_string(GRAY)
    footer = sec.footer.paragraphs[0]
    add_page_number(footer)
    for run in footer.runs:
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor.from_string(GRAY)

doc.core_properties.title = "Bayesian Minimum-Error-Rate Classifier"
doc.core_properties.subject = "Pattern Recognition Laboratory Assignment 1"
doc.core_properties.author = "Hasibur Rahaman"
doc.core_properties.keywords = "Bayesian classifier, Gaussian classifier, Iris dataset, pattern recognition"
doc.save(OUTPUT)
print(OUTPUT)
