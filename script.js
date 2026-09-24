document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-tab');

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Scroll to corresponding page
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Handle Print
    const printBtns = document.querySelectorAll('.print-btn');
    printBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.print();
        });
    });

    // Sync dropdowns to displays
    const syncDropdown = (id, displayClass) => {
        const dropdown = document.getElementById(id);
        if (!dropdown) return;

        const updateAll = () => {
            const val = dropdown.value;
            document.querySelectorAll(displayClass).forEach(disp => { disp.textContent = val; });
        };

        ['change', 'input'].forEach(evt => {
            dropdown.addEventListener(evt, updateAll);
        });
        // Initialize
        updateAll();
    };

    syncDropdown('course-dropdown', '.course-display');
    syncDropdown('part-dropdown', '.part-display');
    syncDropdown('month-dropdown', '.month-display');
    syncDropdown('year-dropdown', '.year-display');

    // Sync subject from text box to all pages
    const updateSubjectDisplays = (val) => {
        const textVal = (val && typeof val === 'string' && val.trim()) ? val.trim() : 'BSc IT C Programing And HTML';
        document.querySelectorAll('.subject-display').forEach(display => {
            display.textContent = textVal;
        });
        const subjectInput = document.getElementById('subject-input');
        if (subjectInput && subjectInput.value !== textVal && val !== undefined && val !== null) {
            subjectInput.value = textVal;
        }
    };

    const mainSubjectInput = document.getElementById('subject-input');
    if (mainSubjectInput) {
        ['input', 'change', 'keyup', 'paste'].forEach(evt => {
            mainSubjectInput.addEventListener(evt, (e) => {
                updateSubjectDisplays(e.target.value);
            });
        });
        updateSubjectDisplays(mainSubjectInput.value);
    }

    const otherSubjectInputs = document.querySelectorAll('.subject-input');
    otherSubjectInputs.forEach(input => {
        if (input !== mainSubjectInput) {
            ['input', 'change', 'keyup', 'paste'].forEach(evt => {
                input.addEventListener(evt, (e) => {
                    updateSubjectDisplays(e.target.value);
                });
            });
        }
    });

    // Sync examiner from textbox to displays
    const examinerInputs = document.querySelectorAll('.examiner-input');
    const examinerDisplays = document.querySelectorAll('.examiner-display, .examiner-name-display');

    examinerInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;

            // Sync any other inputs if they exist
            examinerInputs.forEach(otherInput => {
                if (otherInput !== e.target) {
                    otherInput.value = val;
                }
            });

            // Sync text display spans
            examinerDisplays.forEach(display => {
                display.textContent = val || '__________________________________';
            });
        });
    });

    // Sync examiner 2 from textbox to displays
    const examiner2Inputs = document.querySelectorAll('.examiner2-input');
    const examiner2Displays = document.querySelectorAll('.examiner2-display, .examiner2-name-display');

    examiner2Inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;

            // Sync any other inputs if they exist
            examiner2Inputs.forEach(otherInput => {
                if (otherInput !== e.target) {
                    otherInput.value = val;
                }
            });

            // Sync text display spans
            examiner2Displays.forEach(display => {
                display.textContent = val || '__________________________________';
            });
        });
    });

    // Sync college from textbox to displays
    const collegeInputs = document.querySelectorAll('.college-input');
    const collegeDisplays = document.querySelectorAll('.college-display');

    collegeInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;

            // Sync any other inputs if they exist
            collegeInputs.forEach(otherInput => {
                if (otherInput !== e.target) {
                    otherInput.value = val;
                }
            });

            // Sync text display spans
            collegeDisplays.forEach(display => {
                display.textContent = val || '__________________________________';
            });
        });
    });

    // Sync college 2 from textbox to displays
    const college2Inputs = document.querySelectorAll('.college2-input');
    const college2Displays = document.querySelectorAll('.college2-display');

    college2Inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;

            // Sync any other inputs if they exist
            college2Inputs.forEach(otherInput => {
                if (otherInput !== e.target) {
                    otherInput.value = val;
                }
            });

            // Sync text display spans
            college2Displays.forEach(display => {
                display.textContent = val || '__________________________________';
            });
        });
    });

    // Sync date and calendar picker to all displays and pages
    const formatDateForDisplay = (val) => {
        if (!val) return 'DD/MM/YYYY';
        const str = String(val).trim();
        if (str.includes('-')) {
            const parts = str.split('-');
            if (parts.length === 3 && parts[0].length === 4) {
                // YYYY-MM-DD -> DD/MM/YYYY
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }
        return str;
    };

    const updateAllDateDisplays = (val) => {
        const displayVal = formatDateForDisplay(val);
        const dateDisplays = document.querySelectorAll('.date-display');
        dateDisplays.forEach(display => {
            display.textContent = displayVal;
        });

        // Sync to Page 7 exam date if empty or auto-synced
        const p7ExamDate = document.querySelector('#page7 .staff-exam-date');
        if (p7ExamDate && (!p7ExamDate.value.trim() || p7ExamDate.dataset.autoSynced === 'true')) {
            p7ExamDate.value = displayVal;
            p7ExamDate.dataset.autoSynced = 'true';
        }

        // If val is YYYY-MM-DD, sync to date inputs
        if (val && String(val).includes('-') && String(val).length === 10) {
            const dateInputsToSync = document.querySelectorAll('#date-input, .page-date-sync-input');
            dateInputsToSync.forEach(inp => {
                if (inp.value !== val) {
                    inp.value = val;
                }
            });
        }
    };

    const mainDateInput = document.getElementById('date-input');
    if (mainDateInput) {
        const onDateInput = (e) => {
            updateAllDateDisplays(e.target.value);
        };
        mainDateInput.addEventListener('input', onDateInput);
        mainDateInput.addEventListener('change', onDateInput);
        mainDateInput.addEventListener('click', () => {
            try {
                mainDateInput.showPicker();
            } catch (err) { }
        });
        if (mainDateInput.value) {
            updateAllDateDisplays(mainDateInput.value);
        }
    }

    const pageDateSyncInputs = document.querySelectorAll('.page-date-sync-input');
    pageDateSyncInputs.forEach(inp => {
        const onSyncDateChange = (e) => {
            updateAllDateDisplays(e.target.value);
        };
        inp.addEventListener('input', onSyncDateChange);
        inp.addEventListener('change', onSyncDateChange);
    });

    const otherDateInputs = document.querySelectorAll('.date-input:not(#date-input)');
    otherDateInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            updateAllDateDisplays(e.target.value);
        });
    });

    const updateTableTotals = () => {
        console.log("Calculating table totals...");
        const calculateColumn = (inputClass, totalId, mode = 'sum') => {
            const inputs = document.querySelectorAll(inputClass);
            const totalDisplay = document.getElementById(totalId);
            if (!totalDisplay) {
                console.warn(`Total display not found: ${totalId}`);
                return 0;
            }

            let result = 0;
            inputs.forEach(input => {
                const rawVal = input.value.trim();
                if (!rawVal) return;

                if (mode === 'count') {
                    // For seat numbers, count items separated by commas or spaces
                    const items = rawVal.split(/[, \s]+/).filter(item => {
                        const s = item.toLowerCase();
                        return s.length > 0 && s !== 'nil' && s !== 'none' && s !== '-' && s !== '0' && s !== 'na' && s !== 'n/a';
                    });
                    result += items.length;
                } else {
                    // For numeric counts, sum them up
                    const val = parseFloat(rawVal.replace(/,/g, '')) || 0;
                    result += val;
                }
            });

            console.log(`Column ${totalId} ${mode}:`, result);
            totalDisplay.textContent = result;

            // Brief highlight effect
            const cell = totalDisplay.closest('td');
            if (cell) {
                cell.style.transition = 'background-color 0.3s';
                cell.style.backgroundColor = '#dbeafe';
                setTimeout(() => {
                    cell.style.backgroundColor = '#f8f9fa';
                }, 500);
            }
            return result;
        };

        const totalCalled = calculateColumn('.col-2-input', 'col-2-total', 'sum');
        const totalPresent = calculateColumn('.col-3-input', 'col-3-total', 'sum');
        const totalOutOfTurn = calculateColumn('.col-4-input', 'col-4-total', 'count');

        // Calculate Column 5: "Seat No. of Candidates who were absent Total"
        // Horizontal subtraction in each row: Called (Col 2) - Present (Col 3) - OutOfTurn (Col 4) = Absent Total (Col 5)
        // Total row display: Horizontal (Total Called - Total Present - Total OutOfTurn) and Vertical (Box 1 + Box 2 + Box 3)
        const col5Display = document.getElementById('col-5-total');
        if (col5Display) {
            let totalOf3Boxes = 0;

            [1, 2, 3].forEach(rowIdx => {
                const calledEl = document.getElementById(`p1-r${rowIdx}-c2`);
                const presentEl = document.getElementById(`p1-r${rowIdx}-c3`);
                const outOfTurnEl = document.getElementById(`p1-r${rowIdx}-c4`);
                const absentEl = document.getElementById(`p1-r${rowIdx}-c5`);
                if (!absentEl) return;

                const cRaw = calledEl ? calledEl.value.trim() : '';
                const pRaw = presentEl ? presentEl.value.trim() : '';
                const oRaw = outOfTurnEl ? outOfTurnEl.value.trim() : '';
                const cVal = parseFloat(cRaw.replace(/,/g, '')) || 0;
                const pVal = parseFloat(pRaw.replace(/,/g, '')) || 0;

                // Parse out of turn count for this row (Column 4)
                let oVal = 0;
                if (oRaw) {
                    const lower = oRaw.toLowerCase();
                    if (lower !== 'nil' && lower !== 'none' && lower !== '-' && lower !== '0' && lower !== 'na' && lower !== 'n/a') {
                        const num = parseFloat(oRaw.replace(/,/g, ''));
                        if (!isNaN(num) && /^\d+$/.test(oRaw) && num < 100) {
                            oVal = num;
                        } else {
                            const items = oRaw.split(/[, \s]+/).filter(item => {
                                const s = item.toLowerCase();
                                return s.length > 0 && s !== 'nil' && s !== 'none' && s !== '-' && s !== '0' && s !== 'na' && s !== 'n/a';
                            });
                            oVal = items.length;
                        }
                    }
                }

                // Check if this row has any input across columns
                const hasInput = (cRaw !== '' || pRaw !== '' || (oRaw !== '' && oVal > 0));

                // Horizontal calculation: Called (Col 2) - Present (Col 3) - OutOfTurn (Col 4) = Absent (Col 5)
                const horizontalRowTotal = Math.max(0, cVal - pVal - oVal);

                // Auto-fill row absent/total box horizontally if user hasn't typed custom seat numbers / values
                const isCurrentlyActive = (typeof document !== 'undefined' && document.activeElement === absentEl);
                const isUserEdited = absentEl.dataset.userEdited === 'true';

                if (hasInput && cRaw !== '') {
                    if (!isUserEdited && !isCurrentlyActive) {
                        absentEl.value = horizontalRowTotal.toString();
                        absentEl.dataset.autoCalc = 'true';
                    }
                } else if (absentEl.dataset.autoCalc === 'true' && !isCurrentlyActive) {
                    absentEl.value = '';
                    absentEl.placeholder = '0';
                    delete absentEl.dataset.autoCalc;
                }

                // Determine count for this row's box
                const rawVal = absentEl.value.trim();
                let rowCount = 0;
                if (rawVal) {
                    const lower = rawVal.toLowerCase();
                    if (lower === 'nil' || lower === 'none' || lower === '-' || lower === '0' || lower === 'na' || lower === 'n/a') {
                        rowCount = 0;
                    } else {
                        // Check if it's an explicit count (e.g. 15, 30, etc.)
                        const num = parseFloat(rawVal.replace(/,/g, ''));
                        if (!isNaN(num) && /^\d+$/.test(rawVal)) {
                            rowCount = num;
                        } else {
                            // Seat numbers separated by comma or space (e.g. 101, 102)
                            const items = rawVal.split(/[, \s]+/).filter(item => {
                                const s = item.toLowerCase();
                                return s.length > 0 && s !== 'nil' && s !== 'none' && s !== '-' && s !== '0' && s !== 'na' && s !== 'n/a';
                            });
                            rowCount = items.length;
                        }
                    }
                } else if (hasInput) {
                    rowCount = horizontalRowTotal;
                }

                totalOf3Boxes += rowCount;
            });

            // Horizontal subtraction across total row: Total Called - Total Present - Total OutOfTurn
            const horizontalTotalAcross = Math.max(0, totalCalled - totalPresent - totalOutOfTurn);
            const finalTotalAbsent = Math.max(horizontalTotalAcross, totalOf3Boxes);

            col5Display.textContent = finalTotalAbsent;

            // Highlight cell
            const cell5 = col5Display.closest('td');
            if (cell5) {
                cell5.style.transition = 'background-color 0.3s';
                cell5.style.backgroundColor = '#dbeafe';
                setTimeout(() => {
                    cell5.style.backgroundColor = '#f8f9fa';
                }, 500);
            }
        }

        // Sync totals to Page 4 and Page 5 displays
        const totalPresentText = document.getElementById('col-3-total')?.textContent || totalPresent.toString();
        const studentCount = parseInt(totalPresentText) || 0;

        const page4TotalDisplays = document.querySelectorAll('.page4-total-present');
        page4TotalDisplays.forEach(disp => {
            disp.textContent = totalPresentText;
        });

        // Calculate Remuneration for Page 5
        const part = document.getElementById('part-dropdown')?.value || 'Part - I';
        const rows = {
            'Part - I': 'remun-row-part1',
            'Part - II': 'remun-row-part2',
            'Part - III': 'remun-row-part3',
            'OGT/Projects': 'remun-row-ogt',
            'Part - IV': 'remun-row-ogt'
        };

        // --- Calculate Remuneration for Page 5 (Examiner 1) ---
        const rows1 = {
            'Part - I': 'remun-row-part1',
            'Part - II': 'remun-row-part2',
            'Part - III': 'remun-row-part3',
            'OGT/Projects': 'remun-row-ogt',
            'Part - IV': 'remun-row-ogt'
        };

        let verticalTotal1 = 0;
        Object.keys(rows1).forEach(p => {
            const rowId = rows1[p];
            const row = document.getElementById(rowId);
            if (!row) return;

            const rateInput = row.querySelector('.per-student-input');
            const rate = parseFloat(rateInput?.value) || 0;
            const calcEl = row.querySelector('.remun-calc');
            const rateDisplay = (rate % 1 === 0) ? rate.toFixed(0) : rate.toString();

            const studentCountEl = row.querySelector('.student-count');
            if (studentCountEl) {
                studentCountEl.textContent = studentCount;
            }

            const totalRemun = (studentCount * rate).toFixed(2);
            if (calcEl) {
                calcEl.textContent = studentCount > 0 ? `${studentCount} × ${rateDisplay}` : '0';
            }
            const totalRemunEl = row.querySelector('.total-remun');
            if (totalRemunEl) {
                totalRemunEl.textContent = studentCount > 0 ? totalRemun : '0';
            }

            if (studentCount > 0) {
                verticalTotal1 += (studentCount * rate);
            }

            if (p === part) {
                activeTotal1 = totalRemun;
                row.style.backgroundColor = '#f0f9ff';
            } else {
                row.style.backgroundColor = 'transparent';
            }
        });

        // Add upper box (textbox) value to vertical total (Page 5)
        const extraInput1 = document.getElementById('remun-extra-p5');
        const extraVal1 = parseFloat(extraInput1?.value) || 0;
        verticalTotal1 += extraVal1;

        // Set lower box: total amount of all vertical boxes (Page 5)
        const totalP5El = document.getElementById('remun-total-p5');
        if (totalP5El) {
            totalP5El.textContent = verticalTotal1.toFixed(2);
        }

        // --- Calculate Remuneration for Page 6 (Examiner 2) ---
        const rows2 = {
            'Part - I': 'remun2-row-part1',
            'Part - II': 'remun2-row-part2',
            'Part - III': 'remun2-row-part3',
            'OGT/Projects': 'remun2-row-ogt',
            'Part - IV': 'remun2-row-ogt'
        };

        let verticalTotal2 = 0;
        Object.keys(rows2).forEach(p => {
            const rowId = rows2[p];
            const row = document.getElementById(rowId);
            if (!row) return;

            const rateInput = row.querySelector('.per-student-input');
            const rate = parseFloat(rateInput?.value) || 0;
            const calcEl = row.querySelector('.remun-calc');
            const rateDisplay = (rate % 1 === 0) ? rate.toFixed(0) : rate.toString();

            const studentCountEl = row.querySelector('.student-count');
            if (studentCountEl) {
                studentCountEl.textContent = studentCount;
            }

            const totalRemun = (studentCount * rate).toFixed(2);
            if (calcEl) {
                calcEl.textContent = studentCount > 0 ? `${studentCount} × ${rateDisplay}` : '0';
            }
            const totalRemunEl = row.querySelector('.total-remun');
            if (totalRemunEl) {
                totalRemunEl.textContent = studentCount > 0 ? totalRemun : '0';
            }

            if (studentCount > 0) {
                verticalTotal2 += (studentCount * rate);
            }

            if (p === part) {
                activeTotal2 = totalRemun;
                row.style.backgroundColor = '#f0f9ff';
            } else {
                row.style.backgroundColor = 'transparent';
            }
        });

        // Add upper box (textbox) value to vertical total (Page 6)
        const extraInput2 = document.getElementById('remun-extra-p6');
        const extraVal2 = parseFloat(extraInput2?.value) || 0;
        verticalTotal2 += extraVal2;

        // Set lower box: total amount of all vertical boxes (Page 6)
        const totalP6El = document.getElementById('remun-total-p6');
        if (totalP6El) {
            totalP6El.textContent = verticalTotal2.toFixed(2);
        }

        // Update total remuneration display across all pages
        const totalRemunDisplays = document.querySelectorAll('.total-remun-display');
        totalRemunDisplays.forEach(disp => {
            if (disp.closest('#page5')) disp.textContent = verticalTotal1.toFixed(2);
            if (disp.closest('#page6')) disp.textContent = verticalTotal2.toFixed(2);
        });

        // --- Sync to Page 8 (Final Bill) ---
        const intAmtInput = document.getElementById('p7-int-amt');
        const extAmtInput = document.getElementById('p7-ext-amt');

        if (extAmtInput) extAmtInput.value = Math.round(verticalTotal1);
        if (intAmtInput) intAmtInput.value = Math.round(verticalTotal2);

        // Trigger Page 8 recalculation
        if (typeof updatePage7Totals === 'function') {
            updatePage7Totals();
        }
    };

    // Listen for remuneration input changes
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('remun-input')) {
            updateTableTotals();
        }
    });

    // Listen for Part and Course dropdown changes to update active remuneration
    document.getElementById('part-dropdown')?.addEventListener('change', updateTableTotals);
    document.getElementById('course-dropdown')?.addEventListener('change', updateTableTotals);

    // Navigation Tab Highlighting
    const navTabs = document.querySelectorAll('.nav-tab');
    const pages = document.querySelectorAll('.page');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        pages.forEach(page => {
            const pageTop = page.offsetTop;
            const pageHeight = page.clientHeight;
            if (scrollPos >= (pageTop - 150)) {
                current = page.getAttribute('id');
            }
        });

        navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${current}`) {
                tab.classList.add('active');
            }
        });
    });

    // Listen for both input and change events
    ['input', 'change'].forEach(eventType => {
        document.addEventListener(eventType, (e) => {
            if (e.target.classList.contains('col-5-input')) {
                const val = e.target.value.trim();
                if (val === '') {
                    delete e.target.dataset.userEdited;
                    delete e.target.dataset.autoCalc;
                } else {
                    e.target.dataset.userEdited = 'true';
                    delete e.target.dataset.autoCalc;
                }
            }
            if (e.target.classList.contains('table-input')) {
                updateTableTotals();
            }
        });
    });

    // Helper to convert numbers to words (Basic implementation for billing)
    const numberToWords = (num) => {
        if (num === 0) return 'Zero Only';
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const convert = (n) => {
            if (n < 20) return ones[n];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
            if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
            if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
            return n.toString();
        };

        return convert(Math.floor(num)) + ' Only';
    };

    // Global Staff Detail Synchronization
    const syncPage7To8 = () => {
        const mappings = {
            'p6-name-1': 'p7-exp-name',
            'p6-name-2': 'p7-lab-name-1',
            'p6-name-3': 'p7-lab-name-2',
            'p6-desig-1': 'p7-exp-desig',
            'p6-amt-1': 'p7-exp-amt',
            'p6-desig-2': 'p7-lab-desig-1',
            'p6-amt-2': 'p7-lab-amt-1',
            'p6-desig-3': 'p7-lab-desig-2',
            'p6-amt-3': 'p7-lab-amt-2'
        };

        Object.keys(mappings).forEach(sourceId => {
            const sourceEl = document.getElementById(sourceId);
            const targetEl = document.getElementById(mappings[sourceId]);

            if (sourceEl && targetEl) {
                let val = sourceEl.value;
                if (sourceId.includes('amt')) {
                    // Extract only numbers from the amount string (e.g. "224/-" becomes "224")
                    val = val.split('/')[0].replace(/[^0-9]/g, '');
                }
                targetEl.value = val;
            }
        });

        // After syncing to Page 8, recalculate the Page 8 totals
        if (typeof updatePage7Totals === 'function') {
            updatePage7Totals();
        }
    };
    window.syncPage7To8 = syncPage7To8;

    const updateStaffTotals = () => {
        const staffPage = document.getElementById('page7');
        if (!staffPage) return;

        let grandTotalSum = 0;
        const rows = staffPage.querySelectorAll('table tr');

        rows.forEach(row => {
            const dayInputs = row.querySelectorAll('.day-input');
            const totalBox = row.querySelector('.total-days-input');

            if (dayInputs.length > 0 && totalBox) {
                let rowSum = 0;
                dayInputs.forEach(input => {
                    rowSum += parseFloat(input.value) || 0;
                });

                totalBox.value = rowSum > 0 ? rowSum : '';

                // Rate Multiplication
                const rateInput = row.querySelector('.rate-input');
                const amountInput = row.querySelector('.amount-input');

                if (rateInput && amountInput) {
                    const rateVal = parseFloat(rateInput.value.replace(/[^\d.]/g, '')) || 0;
                    if (rowSum > 0 && rateVal > 0) {
                        const amount = rowSum * rateVal;
                        amountInput.value = amount + '/-';
                        grandTotalSum += amount;
                    } else {
                        amountInput.value = '';
                    }
                }
            }
        });

        // Update Final Totals
        const finalTotalInput = staffPage.querySelector('.staff-grand-total');
        const totalWordsInput = staffPage.querySelector('.staff-total-words');

        if (finalTotalInput) finalTotalInput.value = grandTotalSum > 0 ? grandTotalSum + '/-' : '';
        if (totalWordsInput) totalWordsInput.value = grandTotalSum > 0 ? numberToWords(grandTotalSum) : '';

        // Sync these amounts to Page 8 immediately after calculation
        syncPage7To8();
    };
    window.updateStaffTotals = updateStaffTotals;

    // Page 7 "Date of Examination on which worked" calendar picker logic
    const setupStaffExamDatePicker = () => {
        const pickers = document.querySelectorAll('.staff-exam-date-picker');
        pickers.forEach(picker => {
            const onPick = (e) => {
                const val = e.target.value;
                if (!val) return;
                const parts = val.split('-');
                if (parts.length !== 3) return;
                const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
                const cell = e.target.closest('td');
                const textarea = cell ? cell.querySelector('.staff-exam-date') : null;
                if (textarea) {
                    const current = textarea.value.trim();
                    if (!current) {
                        textarea.value = formatted;
                    } else if (!current.includes('To') && !current.includes('to') && current !== formatted) {
                        textarea.value = `${current} To ${formatted}`;
                    } else {
                        textarea.value = formatted;
                    }

                    // Auto-sync row 1 date to empty rows 2, 3, 4
                    const tr = e.target.closest('tr');
                    const tbody = tr ? tr.parentElement : null;
                    if (tbody && tr === tbody.children[1]) {
                        const rows = tbody.querySelectorAll('tr');
                        rows.forEach((r, idx) => {
                            if (idx > 1) {
                                const otherText = r.querySelector('.staff-exam-date');
                                if (otherText && !otherText.value.trim()) {
                                    otherText.value = textarea.value;
                                }
                            }
                        });
                    }
                }
            };
            picker.addEventListener('change', onPick);
            picker.addEventListener('input', onPick);
            picker.addEventListener('click', () => {
                try {
                    picker.showPicker();
                } catch (err) { }
            });
        });
    };
    setupStaffExamDatePicker();

    // Autonomous Practical Bill (Page 8) Logic
    const updateFinalSummary = () => {
        const exp = parseFloat(document.getElementById('exp-bill-total')?.textContent) || 0;
        const ext = parseFloat(document.getElementById('ext-bill-total')?.textContent) || 0;
        const int = parseFloat(document.getElementById('int-bill-total')?.textContent) || 0;
        const lab = parseFloat(document.getElementById('lab-bill-total')?.textContent) || 0;
        const taSum = parseFloat(document.getElementById('tada-ta-sum')?.textContent) || 0;
        const autoSum = parseFloat(document.getElementById('tada-auto-sum')?.textContent) || 0;
        const daSum = parseFloat(document.getElementById('tada-da-sum')?.textContent) || 0;
        const tadaUpperSum = parseFloat(document.getElementById('tada-bill-total')?.textContent) || 0;

        // TA is TA + Auto from the lower TA/DA table, or falls back to upper TA/DA amount if entered there
        const taVal = (taSum + autoSum) > 0 ? (taSum + autoSum) : (daSum === 0 ? tadaUpperSum : 0);
        const daVal = daSum;
        const paper = parseFloat(document.querySelector('.sum-manual-input')?.value) || 0;

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setVal('sum-exp', exp);
        setVal('sum-ext', ext);
        setVal('sum-int', int);
        setVal('sum-lab', lab);
        setVal('sum-ta', taVal);
        setVal('sum-da', daVal);

        const total = exp + ext + int + lab + taVal + daVal + paper;
        setVal('final-grand-total', total);
        setVal('bill-grand-total', total);
    };

    const updatePage7Totals = () => {
        const sumSection = (inputClass, totalId) => {
            const inputs = document.querySelectorAll(inputClass);
            let total = 0;
            inputs.forEach(input => total += parseFloat(input.value) || 0);
            const totalSpan = document.getElementById(totalId);
            if (totalSpan) totalSpan.textContent = total;
            return total;
        };

        sumSection('.exp-amt-input', 'exp-bill-total');
        sumSection('.ext-amt-input', 'ext-bill-total');
        sumSection('.int-amt-input', 'int-bill-total');
        sumSection('.lab-amt-input', 'lab-bill-total');
        sumSection('.tada-amt-input', 'tada-bill-total');

        updateFinalSummary();
    };

    // Attach listeners for Page 8 inputs
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('bill-input-cell') || e.target.classList.contains('sum-manual-input')) {
            updatePage7Totals();
        }
    });

    // TA/DA Bill (Page 8) Logic
    const updateTadaTotals = () => {
        let taSum = 0, autoSum = 0, daSum = 0, grandSum = 0;

        [1, 2].forEach(rowNum => {
            const ta = parseFloat(document.querySelector(`.tada-val-input[data-row="${rowNum}"][data-type="ta"]`)?.value) || 0;
            const auto = parseFloat(document.querySelector(`.tada-val-input[data-row="${rowNum}"][data-type="auto"]`)?.value) || 0;
            const da = parseFloat(document.querySelector(`.tada-val-input[data-row="${rowNum}"][data-type="da"]`)?.value) || 0;

            const rowTotal = ta + auto + da;
            const totalSpan = document.getElementById(`tada-total-${rowNum}`);
            if (totalSpan) totalSpan.textContent = rowTotal;

            taSum += ta;
            autoSum += auto;
            daSum += da;
            grandSum += rowTotal;
        });

        const taSpan = document.getElementById('tada-ta-sum');
        const autoSpan = document.getElementById('tada-auto-sum');
        const daSpan = document.getElementById('tada-da-sum');
        const grandSpan = document.getElementById('tada-grand-total');

        if (taSpan) taSpan.textContent = taSum;
        if (autoSpan) autoSpan.textContent = autoSum;
        if (daSpan) daSpan.textContent = daSum;
        if (grandSpan) grandSpan.textContent = grandSum;

        updateFinalSummary();
    };

    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('tada-val-input')) {
            updateTadaTotals();
        }
    });

    // Global Synchronization Listener
    document.addEventListener('input', (e) => {
        // If anything on Page 7 changes, update staff totals and sync to Page 8
        if (e.target.closest('#page7')) {
            updateStaffTotals();
            syncPage7To8();
        }

        const id = e.target.id;
        if (!id) return;

        // Global Examiner & Remuneration Sync
        const examinerMappings = {
            'p1-ext-name': ['p7-ext-name', 'p8-ext-name'],
            'p1-int-name': ['p7-int-name'],
            'p1-ext-college': ['p8-ext-college'],
            'p1-ext-desig': ['p7-ext-desig'],
            'p1-int-desig': ['p7-int-desig'],
            'p5-exam-title-1': ['p6-exam-title-1'],
            'p6-exam-title-1': ['p5-exam-title-1'],
            'p5-exam-title-2': ['p6-exam-title-2'],
            'p6-exam-title-2': ['p5-exam-title-2'],
            'p5-exam-title-3': ['p6-exam-title-3'],
            'p6-exam-title-3': ['p5-exam-title-3']
        };

        if (examinerMappings[id]) {
            examinerMappings[id].forEach(targetId => {
                const tel = document.getElementById(targetId);
                if (tel) tel.value = e.target.value;
            });
        }
    });

    // --- Auto-Save and Auto-Load Persistence ---
    // --- Status Indicator ---
    const statusDiv = document.createElement('div');
    statusDiv.id = 'persistence-status';
    statusDiv.style.cssText = 'position: fixed; bottom: 10px; right: 10px; padding: 5px 15px; border-radius: 20px; font-size: 13px; font-weight: 500; font-family: sans-serif; z-index: 10000; background: rgba(0,0,0,0.8); color: white; display: none; transition: all 0.3s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);';
    document.body.appendChild(statusDiv);

    let statusTimeout;
    const showStatus = (text, type = 'info') => {
        clearTimeout(statusTimeout);
        statusDiv.textContent = text;
        statusDiv.style.display = 'block';
        statusDiv.style.opacity = '1';

        if (type === 'success') {
            statusDiv.style.background = 'rgba(40, 167, 69, 0.9)'; // Green
        } else if (type === 'error') {
            statusDiv.style.background = 'rgba(220, 53, 69, 0.9)'; // Red
        } else {
            statusDiv.style.background = 'rgba(0, 0, 0, 0.8)'; // Default Black
        }

        statusTimeout = setTimeout(() => {
            statusDiv.style.opacity = '0';
            setTimeout(() => { statusDiv.style.display = 'none'; }, 300);
        }, 2000);
    };

    let isClearing = false;
    let isLoading = false;

    // Assign permanent, deterministic data-bill-key to every input/select/textarea
    const assignPermanentFieldKeys = () => {
        const container = document.getElementById('app-container') || document.body;
        const pages = container.querySelectorAll('.page');
        pages.forEach(page => {
            const pageId = page.id || 'page';
            const fields = page.querySelectorAll('input, textarea, select');
            fields.forEach((field, i) => {
                if (field.id) {
                    field.dataset.billKey = field.id;
                } else {
                    field.dataset.billKey = `${pageId}_${field.tagName.toLowerCase()}_${i}`;
                }
            });
        });

        const remainingFields = container.querySelectorAll('input:not([data-bill-key]), textarea:not([data-bill-key]), select:not([data-bill-key])');
        remainingFields.forEach((field, i) => {
            if (field.id === 'login-username' || field.id === 'login-password') return;
            field.dataset.billKey = field.id || `app_${field.tagName.toLowerCase()}_${i}`;
        });
    };

    const saveAllData = (isManual = false) => {
        if (isClearing || isLoading) return;
        try {
            assignPermanentFieldKeys();
            const data = {
                version: 2,
                savedAt: new Date().toISOString(),
                by_id: {},
                by_key: {},
                by_index: []
            };

            const container = document.getElementById('app-container') || document.body;
            const inputs = container.querySelectorAll('input, textarea, select');
            inputs.forEach((el, index) => {
                // Don't save login credentials
                if (el.id === 'login-username' || el.id === 'login-password') return;

                const val = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;

                if (el.id) {
                    data.by_id[el.id] = val;
                }
                if (el.dataset.billKey) {
                    data.by_key[el.dataset.billKey] = val;
                }
                data.by_index.push({
                    index: index,
                    key: el.dataset.billKey || el.id || '',
                    type: el.type,
                    value: val
                });
            });

            localStorage.setItem('exam_bill_data', JSON.stringify(data));

            if (isManual) {
                showStatus('✓ All Bill Data Saved Permanently!', 'success');
                const saveBtns = document.querySelectorAll('button[onclick*="saveAllBillDataManually"]');
                saveBtns.forEach(btn => {
                    btn.style.transition = 'all 0.2s ease';
                    btn.style.transform = 'scale(1.05)';
                    btn.style.backgroundColor = '#219653';
                    setTimeout(() => {
                        btn.style.transform = 'scale(1)';
                        btn.style.backgroundColor = '#27ae60';
                    }, 400);
                });
            } else {
                showStatus('Auto-saved', 'success');
            }
        } catch (e) {
            console.error('Save failed:', e);
            showStatus('Save Error', 'error');
        }
    };

    const saveAllBillDataManually = () => {
        saveAllData(true);
    };

    // Debounce function to prevent excessive saving
    let saveTimeout;
    const debouncedSave = () => {
        if (isClearing || isLoading) return;
        clearTimeout(saveTimeout);
        statusDiv.textContent = 'Saving...';
        statusDiv.style.display = 'block';
        statusDiv.style.opacity = '1';
        statusDiv.style.background = 'rgba(0, 123, 255, 0.8)'; // Blue for saving

        saveTimeout = setTimeout(() => {
            saveAllData(false);
        }, 800);
    };

    const loadAllData = () => {
        let savedData = null;

        // Check if there is data in the URL query params
        try {
            if (typeof window !== 'undefined' && window.location && window.location.search) {
                const urlParams = new URLSearchParams(window.location.search);
                const sharedBase64 = urlParams.get('bill_data');
                if (sharedBase64) {
                    const decodedJson = decodeURIComponent(escape(atob(sharedBase64)));
                    savedData = decodedJson;
                    localStorage.setItem('exam_bill_data', decodedJson);

                    // Clean the URL search params without refreshing the page
                    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
                }
            }
        } catch (e) {
            console.error('Failed to parse query param data:', e);
        }

        if (!savedData) {
            try {
                savedData = localStorage.getItem('exam_bill_data');
            } catch (e) {
                console.error('Failed to read localStorage:', e);
            }
        }

        if (!savedData) return false;

        isLoading = true;
        try {
            const data = JSON.parse(savedData);
            assignPermanentFieldKeys();
            const container = document.getElementById('app-container') || document.body;
            const allFields = container.querySelectorAll('input, textarea, select');

            // 1. Restore by deterministic key
            if (data.by_key && typeof data.by_key === 'object') {
                allFields.forEach(el => {
                    if (el.id === 'login-username' || el.id === 'login-password') return;
                    const key = el.dataset.billKey;
                    if (key && data.by_key[key] !== undefined) {
                        if (el.type === 'checkbox' || el.type === 'radio') {
                            el.checked = Boolean(data.by_key[key]);
                        } else {
                            el.value = data.by_key[key];
                        }
                    }
                });
            }

            // 2. Restore by ID
            if (data.by_id && typeof data.by_id === 'object') {
                Object.keys(data.by_id).forEach(id => {
                    if (id === 'login-username' || id === 'login-password') return;
                    const el = document.getElementById(id);
                    if (el) {
                        if (el.type === 'checkbox' || el.type === 'radio') {
                            el.checked = Boolean(data.by_id[id]);
                        } else {
                            el.value = data.by_id[id];
                        }
                    }
                });
            }

            // 3. Fallback for legacy format (by numeric index)
            if (!data.by_key && data.by_index && Array.isArray(data.by_index)) {
                const legacyInputs = document.querySelectorAll('input, textarea, select');
                data.by_index.forEach(item => {
                    const el = legacyInputs[item.index];
                    if (el && !el.id && el.type === item.type) {
                        if (el.type === 'checkbox' || el.type === 'radio') {
                            el.checked = Boolean(item.value);
                        } else {
                            el.value = item.value;
                        }
                    }
                });
            }

            // Ensure subject text box is properly restored
            const savedSubject = data.by_id ? (data.by_id['subject-input'] || data.by_id['subject-dropdown']) : null;
            const subjInputEl = document.getElementById('subject-input');
            if (savedSubject && typeof savedSubject === 'string' && savedSubject.trim()) {
                if (subjInputEl) {
                    subjInputEl.value = savedSubject.trim();
                }
                updateSubjectDisplays(savedSubject.trim());
            } else {
                const fallbackSubject = subjInputEl?.value?.trim() || 'BSc IT C Programing And HTML';
                if (subjInputEl) subjInputEl.value = fallbackSubject;
                updateSubjectDisplays(fallbackSubject);
            }

            // Sync and recalculate all derived values
            syncAllDisplays();
            updateTableTotals();
            updateStaffTotals();
            updatePage7Totals();
            updateTadaTotals();

            showStatus('✓ Saved Data Restored', 'success');
            return true;
        } catch (e) {
            console.error('Load failed:', e);
            return false;
        } finally {
            isLoading = false;
        }
    };

    const clearAllBillData = () => {
        if (!confirm('Are you sure you want to clear all data? This will clear all filled form fields.')) {
            return;
        }

        isClearing = true;
        clearTimeout(saveTimeout);

        try {
            // Remove persisted data from localStorage
            localStorage.removeItem('exam_bill_data');

            // Clean query params if loaded from shared link
            if (typeof window !== 'undefined' && window.location && window.location.search) {
                const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
            }

            // Clear all user inputs & textareas
            const container = document.getElementById('app-container') || document.body;
            const inputs = container.querySelectorAll('input, textarea');
            inputs.forEach(el => {
                // Keep fixed per-student rates and staff rates
                if (el.classList.contains('per-student-input') || el.classList.contains('rate-input')) {
                    return;
                }
                // Don't touch login inputs
                if (el.id === 'login-username' || el.id === 'login-password') {
                    return;
                }
                if (el.type === 'checkbox' || el.type === 'radio') {
                    el.checked = false;
                } else {
                    el.value = '';
                }
            });

            // Reset all selects to first option
            const selects = container.querySelectorAll('select');
            selects.forEach(sel => {
                sel.selectedIndex = 0;
            });

            // Reset subject text box to default
            const subjInputEl = document.getElementById('subject-input');
            if (subjInputEl) {
                subjInputEl.value = 'BSc IT C Programing And HTML';
            }
            updateSubjectDisplays('BSc IT C Programing And HTML');

            // Reset exam title text boxes to default (Page 5 & 6)
            const defaultExamTitles = {
                'p5-exam-title-1': 'B.Sc./B.C.S. Part I',
                'p5-exam-title-2': 'B.Sc./B.C.S. Part II',
                'p5-exam-title-3': 'B.Sc./B.C.S. Part III',
                'p6-exam-title-1': 'B.Sc./B.C.S. Part I',
                'p6-exam-title-2': 'B.Sc./B.C.S. Part II',
                'p6-exam-title-3': 'B.Sc./B.C.S. Part III'
            };
            Object.keys(defaultExamTitles).forEach(titleId => {
                const tel = document.getElementById(titleId);
                if (tel) tel.value = defaultExamTitles[titleId];
            });

            document.querySelectorAll('.examiner-display, .examiner-name-display').forEach(d => d.textContent = '__________________________________');
            document.querySelectorAll('.examiner2-display, .examiner2-name-display').forEach(d => d.textContent = '__________________________________');
            document.querySelectorAll('.college-display').forEach(d => d.textContent = 'WILLINGDON COLLEGE SANGLI');
            document.querySelectorAll('.college2-display').forEach(d => d.textContent = 'WILLINGDON COLLEGE SANGLI');

            const mainDate = document.getElementById('date-input');
            if (mainDate) mainDate.value = '2026-09-23';
            updateAllDateDisplays('2026-09-23');

            // Reset attendance table totals
            ['col-2-total', 'col-3-total', 'col-4-total', 'col-5-total'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '0';
            });
            document.querySelectorAll('.col-5-input').forEach(el => {
                el.value = '';
                el.placeholder = '0';
                delete el.dataset.userEdited;
                delete el.dataset.autoCalc;
            });
            document.querySelectorAll('.page4-total-present').forEach(d => d.textContent = '0');

            // Reset remuneration rows (Page 5 & 6)
            document.querySelectorAll('.student-count').forEach(el => el.textContent = '0');
            document.querySelectorAll('.remun-calc').forEach(el => el.textContent = '0');
            document.querySelectorAll('.total-remun').forEach(el => el.textContent = '0');
            document.querySelectorAll('.total-remun-display').forEach(el => el.textContent = '0');
            document.querySelectorAll('.remun-extra-input').forEach(el => el.value = '');
            document.querySelectorAll('.remun-vertical-total').forEach(el => el.textContent = '0');
            document.querySelectorAll('#page5 tr, #page6 tr').forEach(row => {
                if (row.id && (row.id.startsWith('remun-row') || row.id.startsWith('remun2-row'))) {
                    row.style.backgroundColor = 'transparent';
                }
            });

            // Reset staff amounts and totals (Page 7)
            document.querySelectorAll('.total-days-input, .amount-input, .staff-grand-total, .staff-total-words').forEach(el => el.value = '');

            // Reset bill summary totals (Page 8)
            ['exp-bill-total', 'ext-bill-total', 'int-bill-total', 'lab-bill-total', 'tada-bill-total', 'bill-grand-total'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '0';
            });

            // Reset TA/DA totals
            ['tada-total-1', 'tada-total-2', 'tada-ta-sum', 'tada-auto-sum', 'tada-da-sum', 'tada-grand-total'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '0';
            });

            // Reset final summary list
            ['sum-exp', 'sum-int', 'sum-ext', 'sum-lab', 'sum-ta', 'sum-da', 'final-grand-total'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '0';
            });

            // Run full sync & recalculation
            syncAllDisplays();
            updateTableTotals();
            updateStaffTotals();
            updatePage7Totals();
            updateTadaTotals();

            // Save the blank state to localStorage so it stays empty on reload
            assignPermanentFieldKeys();
            const data = { version: 2, savedAt: new Date().toISOString(), by_id: {}, by_key: {}, by_index: [] };
            const allInputs = container.querySelectorAll('input, textarea, select');
            allInputs.forEach((el, index) => {
                if (el.id === 'login-username' || el.id === 'login-password') return;
                const val = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
                if (el.id) data.by_id[el.id] = val;
                if (el.dataset.billKey) data.by_key[el.dataset.billKey] = val;
                data.by_index.push({ index: index, key: el.dataset.billKey || el.id || '', type: el.type, value: val });
            });
            localStorage.setItem('exam_bill_data', JSON.stringify(data));

            showStatus('All data cleared', 'success');
        } catch (err) {
            console.error('Clear failed:', err);
            showStatus('Clear failed', 'error');
        } finally {
            isClearing = false;
        }
    };

    const syncAllDisplays = () => {
        const getVal = (id) => document.getElementById(id)?.value || '';

        // Subject sync from text box to all pages
        const subjInput = document.getElementById('subject-input');
        const currentSubject = (subjInput && subjInput.value && subjInput.value.trim()) ? subjInput.value.trim() : 'BSc IT C Programing And HTML';
        updateSubjectDisplays(currentSubject);

        const extName = getVal('p1-ext-name');
        document.querySelectorAll('.examiner-display').forEach(d => d.textContent = extName || '__________________________________');
        ['p7-ext-name', 'p8-ext-name'].forEach(tid => {
            const tel = document.getElementById(tid);
            if (tel) tel.value = extName;
        });

        const intName = getVal('p1-int-name');
        document.querySelectorAll('.examiner2-display').forEach(d => d.textContent = intName || '__________________________________');
        ['p7-int-name', 'p8-int-name'].forEach(tid => {
            const tel = document.getElementById(tid);
            if (tel) tel.value = intName;
        });

        const extCollege = getVal('p1-ext-college');
        document.querySelectorAll('.college-display').forEach(d => d.textContent = extCollege || 'WILLINGDON COLLEGE SANGLI');
        const extCollegeInput = document.getElementById('p8-ext-college');
        if (extCollegeInput) extCollegeInput.value = extCollege;

        const intCollege = getVal('p1-int-college');
        document.querySelectorAll('.college2-display').forEach(d => d.textContent = intCollege || 'WILLINGDON COLLEGE SANGLI');

        const mainDate = document.getElementById('date-input');
        const dateVal = mainDate ? mainDate.value : getVal('date-input');
        updateAllDateDisplays(dateVal || '2026-09-23');

        const courseVal = document.getElementById('course-dropdown')?.value || '';
        document.querySelectorAll('.course-display').forEach(disp => { disp.textContent = courseVal; });

        const partVal = document.getElementById('part-dropdown')?.value || '';
        document.querySelectorAll('.part-display').forEach(disp => { disp.textContent = partVal; });

        const monthVal = document.getElementById('month-dropdown')?.value || '';
        document.querySelectorAll('.month-display').forEach(disp => { disp.textContent = monthVal; });

        const yearVal = document.getElementById('year-dropdown')?.value || '';
        document.querySelectorAll('.year-display').forEach(disp => { disp.textContent = yearVal; });
    };

    // Global input and change listeners
    document.addEventListener('input', (e) => {
        if (e.target.closest('#login-screen')) return;
        debouncedSave();
        syncAllDisplays();
    });

    document.addEventListener('change', (e) => {
        if (e.target.closest('#login-screen')) return;
        debouncedSave();
        syncAllDisplays();
    });

    // Keyboard shortcut: Ctrl+S or Cmd+S to save permanently
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            saveAllBillDataManually();
        }
    });

    // Final save on close / navigate away
    window.addEventListener('beforeunload', () => {
        if (!isClearing && !isLoading) {
            saveAllData(false);
        }
    });

    // --- Sharing Logic ---
    const getShareableLink = () => {
        try {
            assignPermanentFieldKeys();
            const data = {
                version: 2,
                savedAt: new Date().toISOString(),
                by_id: {},
                by_key: {},
                by_index: []
            };
            const container = document.getElementById('app-container') || document.body;
            const inputs = container.querySelectorAll('input, textarea, select');
            inputs.forEach((el, index) => {
                if (el.id === 'login-username' || el.id === 'login-password') return;
                const val = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
                if (el.id) data.by_id[el.id] = val;
                if (el.dataset.billKey) data.by_key[el.dataset.billKey] = val;
                data.by_index.push({ index: index, key: el.dataset.billKey || el.id || '', type: el.type, value: val });
            });

            const jsonStr = JSON.stringify(data);
            const base64 = btoa(unescape(encodeURIComponent(jsonStr)));

            let baseLoc = "http://localhost:8000/";
            if (typeof window !== 'undefined' && window.location) {
                baseLoc = window.location.protocol + "//" + window.location.host + window.location.pathname;
            }
            const url = new URL(baseLoc);
            url.searchParams.set('bill_data', base64);
            return url.toString();
        } catch (e) {
            console.error('Failed to generate share link:', e);
            if (typeof window !== 'undefined' && window.location) {
                return window.location.origin + window.location.pathname;
            }
            return "http://localhost:8000/";
        }
    };

    const openShareModal = () => {
        const backdrop = document.getElementById('share-modal-backdrop');
        const urlInput = document.getElementById('share-url-input');
        if (backdrop && urlInput) {
            const shareableUrl = getShareableLink();
            urlInput.value = shareableUrl;

            // Configure sharing links
            const shareText = encodeURIComponent("Here is the filled Willingdon College Exam Remuneration Bill form data:");
            const shareUrl = encodeURIComponent(shareableUrl);

            const whatsapp = document.getElementById('share-whatsapp');
            if (whatsapp) whatsapp.href = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;

            const telegram = document.getElementById('share-telegram');
            if (telegram) telegram.href = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;

            const email = document.getElementById('share-email');
            if (email) email.href = `mailto:?subject=Willingdon%20College%20Exam%20Bill%20Data&body=${shareText}%0A%0A${shareUrl}`;

            // Check native sharing support
            const nativeBtn = document.getElementById('share-native');
            if (nativeBtn) {
                if (navigator.share) {
                    nativeBtn.style.display = 'flex';
                } else {
                    nativeBtn.style.display = 'none';
                }
            }

            backdrop.style.display = 'flex';
        }
    };

    const closeShareModal = () => {
        const backdrop = document.getElementById('share-modal-backdrop');
        if (backdrop) backdrop.style.display = 'none';
    };

    const copyShareUrl = () => {
        const urlInput = document.getElementById('share-url-input');
        if (urlInput) {
            urlInput.select();
            urlInput.setSelectionRange(0, 99999); // For mobile devices
            navigator.clipboard.writeText(urlInput.value).then(() => {
                showToastNotification("Link copied to clipboard!");
            }).catch(err => {
                console.error("Failed to copy link:", err);
            });
        }
    };

    const shareNative = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Willingdon College Exam Billing Portal',
                text: 'Here is my filled exam remuneration bill details.',
                url: getShareableLink()
            }).catch(console.error);
        }
    };

    const showToastNotification = (msg) => {
        const toast = document.getElementById('toast-notification');
        const text = document.getElementById('toast-text');
        if (toast && text) {
            text.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }
    };

    // --- Authentication & Access Control ---
    const checkAuth = () => {
        // Clear any old persisted authentication so the login screen always shows first
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('authenticated');
            }
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem('authenticated');
            }
        } catch (e) { }

        const loginScreen = document.getElementById('login-screen');
        const appContainer = document.getElementById('app-container');

        // Always show login screen first
        if (loginScreen) {
            loginScreen.style.display = 'flex';
            loginScreen.style.opacity = '1';
            document.body.classList.remove('logged-in');
            if (window.enableCursorTrail) window.enableCursorTrail();
        }
        if (appContainer) {
            appContainer.style.display = 'none';
        }
        const mainNav = document.getElementById('main-nav');
        if (mainNav) {
            mainNav.classList.remove('nav-animate-in');
        }
        return false;
    };

    const updateLoginButtonState = () => {
        const userEl = document.getElementById('login-username');
        const passEl = document.getElementById('login-password');
        const btnEl = document.getElementById('login-btn');
        const progressBar = document.getElementById('login-progress-bar');
        if (!userEl || !passEl || !btnEl) return;

        const userVal = userEl.value.trim();
        const passVal = passEl.value;
        const targetUser = 'admin';
        const targetPass = 'willingdon123';

        const hasUser = userVal.length > 0;
        const hasPass = passVal.length > 0;

        // 1. Prefix and exact matching for Username
        const isUserPrefixMatch = hasUser && targetUser.toLowerCase().startsWith(userVal.toLowerCase());
        const isUserExactMatch = hasUser && (userVal.toLowerCase() === targetUser.toLowerCase());
        const isUserIncorrect = hasUser && (!isUserPrefixMatch || userVal.length > targetUser.length);

        // 2. Character-by-character check for Password
        let matchCount = 0;
        let isPassIncorrect = false;
        if (hasPass) {
            for (let i = 0; i < passVal.length; i++) {
                if (i < targetPass.length && passVal[i] === targetPass[i]) {
                    matchCount++;
                } else {
                    isPassIncorrect = true;
                    break;
                }
            }
            if (passVal.length > targetPass.length) {
                isPassIncorrect = true;
            }
        }

        const isExactMatch = isUserExactMatch && (passVal === targetPass);

        // IF USER ENTERED SOMETHING INCORRECT: Robot becomes ANGRY!
        if (isUserIncorrect || isPassIncorrect) {
            btnEl.classList.remove('btn-revealing', 'btn-fully-unlocked');
            btnEl.style.opacity = '0';
            btnEl.style.transform = 'translateY(14px) scale(0.94)';
            btnEl.style.pointerEvents = 'none';
            if (progressBar) progressBar.style.width = '0%';
            if (window.set3DUsernameProgress) window.set3DUsernameProgress(0);
            if (window.set3DPasswordProgress) window.set3DPasswordProgress(0);
            if (window.set3DState) window.set3DState('angry');
            return;
        }

        // IF EMPTY: Robot in calm idle state with closed eyes
        if (!hasUser && !hasPass) {
            btnEl.classList.remove('btn-revealing', 'btn-fully-unlocked');
            btnEl.style.opacity = '0';
            btnEl.style.transform = 'translateY(14px) scale(0.94)';
            btnEl.style.pointerEvents = 'none';
            if (progressBar) progressBar.style.width = '0%';
            if (window.set3DUsernameProgress) window.set3DUsernameProgress(0);
            if (window.set3DPasswordProgress) window.set3DPasswordProgress(0);
            if (window.set3DState) window.set3DState('idle');
            return;
        }

        // IF USER IS TYPING 'admin' CORRECTLY, but hasn't entered password yet
        if (!hasPass) {
            btnEl.classList.remove('btn-revealing', 'btn-fully-unlocked');
            btnEl.style.opacity = '0';
            btnEl.style.transform = 'translateY(14px) scale(0.94)';
            btnEl.style.pointerEvents = 'none';
            if (progressBar) progressBar.style.width = '0%';
            const userProgress = userVal.length / targetUser.length;
            if (window.set3DUsernameProgress) window.set3DUsernameProgress(userProgress);
            if (window.set3DPasswordProgress) window.set3DPasswordProgress(0);

            // Robot eyes awaken and open in cyber green as user types admin!
            if (window.set3DState) window.set3DState('username');
            return;
        }

        // IF USER HAS NOT FULLY FINISHED TYPING 'admin' (e.g. 'adm') but entered password characters
        if (!isUserExactMatch) {
            btnEl.classList.remove('btn-revealing', 'btn-fully-unlocked');
            btnEl.style.opacity = '0';
            btnEl.style.transform = 'translateY(14px) scale(0.94)';
            btnEl.style.pointerEvents = 'none';
            if (progressBar) progressBar.style.width = '0%';
            const userProgress = userVal.length / targetUser.length;
            if (window.set3DUsernameProgress) window.set3DUsernameProgress(userProgress);
            if (window.set3DPasswordProgress) window.set3DPasswordProgress(0);
            if (window.set3DState) window.set3DState('username');
            return;
        }

        // HERE: Both Login ID is 'admin' AND password characters match 'willingdon123' so far!
        btnEl.classList.add('btn-revealing');

        const progress = matchCount / targetPass.length;
        const dynamicOpacity = Math.min(1.0, 0.20 + (progress * 0.80));
        const dynamicTranslateY = (1 - progress) * 10;
        const dynamicScale = 0.94 + (progress * 0.06);

        btnEl.style.opacity = dynamicOpacity.toFixed(2);
        btnEl.style.transform = `translateY(${dynamicTranslateY.toFixed(1)}px) scale(${dynamicScale.toFixed(3)})`;
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.round(progress * 100))}%`;
        }

        // Real-time green charging in 3D: eyes open wider in sync with password
        if (window.set3DUsernameProgress) window.set3DUsernameProgress(1.0);
        if (window.set3DPasswordProgress) {
            window.set3DPasswordProgress(progress);
        }

        // When fully matched
        if (isExactMatch) {
            btnEl.classList.add('btn-fully-unlocked');
            btnEl.style.pointerEvents = 'auto';
            if (window.set3DState) window.set3DState('ready');
        } else {
            btnEl.classList.remove('btn-fully-unlocked');
            btnEl.style.pointerEvents = 'none';
            if (window.set3DState) window.set3DState('password');
        }
    };

    const attemptLogin = () => {
        const userEl = document.getElementById('login-username');
        const passEl = document.getElementById('login-password');
        const errorEl = document.getElementById('login-error-msg');
        const cardEl = document.getElementById('login-card-element');

        if (!userEl || !passEl) return;

        const username = userEl.value.trim();
        const password = passEl.value;

        // Accept admin / willingdon123 (case-insensitive for username)
        if (username.toLowerCase() === 'admin' && password === 'willingdon123') {
            if (errorEl) errorEl.style.display = 'none';
            if (window.set3DState) window.set3DState('success');

            // Disable cursor trail immediately upon login so no color trail is left inside website
            document.body.classList.add('logged-in');
            if (window.disableCursorTrail) window.disableCursorTrail();

            // Smooth fade-out transition
            const loginScreen = document.getElementById('login-screen');
            const appContainer = document.getElementById('app-container');
            if (loginScreen) {
                loginScreen.style.opacity = '0';
                setTimeout(() => {
                    loginScreen.style.display = 'none';
                    if (window.disableCursorTrail) window.disableCursorTrail();
                    if (appContainer) {
                        appContainer.style.display = 'block';
                        const mainNav = document.getElementById('main-nav');
                        if (mainNav) {
                            mainNav.classList.remove('nav-animate-in');
                            void mainNav.offsetWidth;
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    mainNav.classList.add('nav-animate-in');
                                });
                            });
                        }
                    }
                    userEl.value = '';
                    passEl.value = '';
                    updateLoginButtonState();

                    // Load saved bill data immediately upon login!
                    loadAllData();
                    syncAllDisplays();
                    updateTableTotals();
                    updateStaffTotals();
                    updatePage7Totals();
                    updateTadaTotals();
                }, 400);
            } else {
                if (window.disableCursorTrail) window.disableCursorTrail();
                if (appContainer) {
                    appContainer.style.display = 'block';
                    const mainNav = document.getElementById('main-nav');
                    if (mainNav) {
                        mainNav.classList.remove('nav-animate-in');
                        void mainNav.offsetWidth;
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                mainNav.classList.add('nav-animate-in');
                            });
                        });
                    }
                }
                loadAllData();
                syncAllDisplays();
                updateTableTotals();
                updateStaffTotals();
                updatePage7Totals();
                updateTadaTotals();
            }
        } else {
            if (errorEl) errorEl.style.display = 'block';
            if (window.set3DState) window.set3DState('angry');
            if (cardEl) {
                cardEl.classList.remove('shake');
                void cardEl.offsetWidth; // Trigger layout reflow to restart animation
                cardEl.classList.add('shake');
            }
        }
    };

    const toggleLoginPassword = () => {
        const passEl = document.getElementById('login-password');
        const iconEl = document.getElementById('eye-icon');
        if (passEl) {
            if (passEl.type === 'password') {
                passEl.type = 'text';
                if (iconEl) {
                    iconEl.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
                }
            } else {
                passEl.type = 'password';
                if (iconEl) {
                    iconEl.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
                }
            }
        }
    };

    const logout = () => {
        if (confirm('Are you sure you want to logout?')) {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('authenticated');
                }
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.removeItem('authenticated');
                }
            } catch (e) { }
            location.reload();
        }
    };

    const printPage = (pageId, orientation = 'landscape') => {
        const page = document.getElementById(pageId);
        if (!page) {
            window.print();
            return;
        }

        const prevStyle = document.getElementById('dynamic-single-print-style');
        if (prevStyle) prevStyle.remove();

        const printStyle = document.createElement('style');
        printStyle.id = 'dynamic-single-print-style';
        printStyle.innerHTML = `
            @media print {
                @page { 
                    size: A4 ${orientation}; 
                    margin: 10mm; 
                }
                body { 
                    background: white !important; 
                    padding: 0 !important; 
                    margin: 0 !important; 
                }
                #login-screen, 
                #persistence-status, 
                .no-print, 
                .print-btn, 
                nav, 
                .share-backdrop { 
                    display: none !important; 
                }
                #app-container > .page:not(#${pageId}) { 
                    display: none !important; 
                }
                #app-container > #${pageId} { 
                    display: block !important; 
                    width: 297mm !important; 
                    max-width: 297mm !important; 
                    min-height: 210mm !important; 
                    margin: 0 !important; 
                    box-shadow: none !important; 
                    padding: 8mm 12mm !important; 
                    page-break-after: avoid !important;
                    break-after: avoid !important;
                }
            }
        `;
        document.head.appendChild(printStyle);

        window.print();

        setTimeout(() => {
            if (printStyle && printStyle.parentNode) {
                printStyle.remove();
            }
        }, 1500);
    };

    // -------------------------------------------------------------
    // Comprehensive Bill Completeness Verification
    // -------------------------------------------------------------
    const checkFormFilledStatus = () => {
        const requiredChecks = [
            { id: 'subject-input', label: 'Subject / Paper Name', pageId: 'page1' },
            { id: 'date-input', label: 'Date of Examination', pageId: 'page1' },
            { id: 'p1-ext-name', label: 'External Examiner Name', pageId: 'page1' },
            { id: 'p1-int-name', label: 'Internal Examiner Name', pageId: 'page1' },
            { id: 'p1-ext-college', label: 'External College / Institute', pageId: 'page1' },
            { id: 'p1-int-college', label: 'Internal College / Institute', pageId: 'page1' },
            { id: 'course-dropdown', label: 'Course / Class (e.g. B.SC.IT)', pageId: 'page1' },
            { id: 'part-dropdown', label: 'Part / Semester (e.g. Part - I)', pageId: 'page1' },
            { id: 'month-dropdown', label: 'Examination Month', pageId: 'page1' },
            { id: 'year-dropdown', label: 'Examination Year', pageId: 'page1' }
        ];

        const missing = [];
        requiredChecks.forEach(item => {
            const el = document.getElementById(item.id);
            const val = el ? (el.value ? el.value.trim() : '') : '';
            if (!val || val === '__________________________________') {
                missing.push(item);
            }
        });

        return {
            isFull: missing.length === 0,
            missingFields: missing,
            totalFields: requiredChecks.length,
            filledCount: requiredChecks.length - missing.length
        };
    };

    // Store current missing fields for modal focus action
    let currentMissingFields = [];

    const openDownloadConfirmModal = (status) => {
        currentMissingFields = status.missingFields;
        const modal = document.getElementById('download-confirm-modal-backdrop');
        const listContainer = document.getElementById('missing-fields-list');
        if (!modal || !listContainer) return;

        listContainer.innerHTML = '';
        currentMissingFields.forEach(item => {
            const row = document.createElement('div');
            row.className = 'missing-field-item';
            row.innerHTML = `<span class="missing-field-bullet"></span><span>${item.label}</span>`;
            listContainer.appendChild(row);
        });

        modal.style.display = 'flex';
    };

    const closeDownloadConfirmModal = () => {
        const modal = document.getElementById('download-confirm-modal-backdrop');
        if (modal) modal.style.display = 'none';
    };

    const focusFirstMissingField = () => {
        closeDownloadConfirmModal();
        if (currentMissingFields.length > 0) {
            const firstItem = currentMissingFields[0];
            const targetEl = document.getElementById(firstItem.id);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    targetEl.focus();
                    targetEl.classList.remove('field-highlight');
                    void targetEl.offsetWidth; // trigger reflow
                    targetEl.classList.add('field-highlight');
                    setTimeout(() => targetEl.classList.remove('field-highlight'), 3500);
                }, 400);
            }
        }
    };

    // -------------------------------------------------------------
    // Main Download PDF Trigger
    // -------------------------------------------------------------
    const handleDownloadPdf = () => {
        // First, check completeness
        const status = checkFormFilledStatus();
        if (!status.isFull) {
            // Form is incomplete: prompt user with confirmation modal
            openDownloadConfirmModal(status);
            return;
        }

        // Form is 100% full: proceed directly to PDF generation
        startPdfDownload(false);
    };

    // -------------------------------------------------------------
    // Multi-Page A4 PDF Generation & Direct Download
    // -------------------------------------------------------------
    let isGeneratingPdf = false;

    const startPdfDownload = async (bypassCheck = false) => {
        if (isGeneratingPdf) return;
        closeDownloadConfirmModal();

        // Check if html2canvas and jsPDF are loaded
        const hasJsPdf = (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) || (typeof window.jsPDF !== 'undefined');
        if (typeof html2canvas === 'undefined' || !hasJsPdf) {
            alert('PDF generation engine is still loading. Please wait 2 seconds and try again.');
            return;
        }

        isGeneratingPdf = true;

        const progressModal = document.getElementById('download-progress-modal-backdrop');
        const progressBar = document.getElementById('download-progress-bar-fill');
        const progressStepText = document.getElementById('pdf-progress-step-text');
        const progressPercentText = document.getElementById('pdf-progress-percent-text');

        const updateProgress = (percent, text) => {
            if (progressBar) progressBar.style.width = percent + '%';
            if (progressPercentText) progressPercentText.textContent = percent + '%';
            if (progressStepText) progressStepText.textContent = text;
        };

        if (progressModal) progressModal.style.display = 'flex';
        updateProgress(5, 'Preparing bill pages and syncing form fields...');

        // Synchronize all input values to DOM value attributes for canvas fidelity
        document.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.tagName === 'SELECT') {
                for (let i = 0; i < el.options.length; i++) {
                    if (i === el.selectedIndex) el.options[i].setAttribute('selected', 'selected');
                    else el.options[i].removeAttribute('selected');
                }
            } else if (el.type === 'checkbox' || el.type === 'radio') {
                if (el.checked) el.setAttribute('checked', 'checked');
                else el.removeAttribute('checked');
            } else {
                el.setAttribute('value', el.value);
            }
        });

        // Add clean export mode to body
        document.body.classList.add('pdf-export-mode');

        const pageConfigs = [
            { id: 'page1', name: 'Attendance Sheet', orientation: 'portrait', widthMm: 210, heightMm: 297 },
            { id: 'page2', name: 'Laboratory Certificate', orientation: 'portrait', widthMm: 210, heightMm: 297 },
            { id: 'page3', name: 'Laboratory Arrangement', orientation: 'portrait', widthMm: 210, heightMm: 297 },
            { id: 'page4', name: 'Verification Certificate', orientation: 'portrait', widthMm: 210, heightMm: 297 },
            { id: 'page5', name: 'Remuneration Bill (External)', orientation: 'portrait', widthMm: 210, heightMm: 297 },
            { id: 'page6', name: 'Remuneration Bill (Internal)', orientation: 'portrait', widthMm: 210, heightMm: 297 },
            { id: 'page7', name: 'Assistants & Staff Bill (Landscape)', orientation: 'landscape', widthMm: 297, heightMm: 210 },
            { id: 'page8', name: 'Final Bill & TA/DA (Landscape)', orientation: 'landscape', widthMm: 297, heightMm: 210 }
        ];

        try {
            const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
            const pdf = new jsPDFConstructor({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const totalPages = pageConfigs.length;

            for (let i = 0; i < totalPages; i++) {
                const config = pageConfigs[i];
                const pageNum = i + 1;
                const pageEl = document.getElementById(config.id);

                if (!pageEl) {
                    console.warn(`Page element #${config.id} not found.`);
                    continue;
                }

                const currentPercent = Math.round(10 + (i / totalPages) * 75);
                updateProgress(currentPercent, `Rendering Page ${pageNum} of ${totalPages}: ${config.name}...`);

                // Ensure page is settled
                await new Promise(r => setTimeout(r, 60));

                const canvas = await html2canvas(pageEl, {
                    scale: 2, // 2x crisp retina resolution
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    scrollX: 0,
                    scrollY: 0,
                    ignoreElements: (el) => {
                        return el.classList && (
                            el.classList.contains('no-print') ||
                            el.classList.contains('cursor-trail-canvas') ||
                            el.id === 'login-screen' ||
                            el.id === 'main-nav' ||
                            el.id === 'download-confirm-modal-backdrop' ||
                            el.id === 'download-progress-modal-backdrop'
                        );
                    }
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.95);

                if (i === 0) {
                    // First page: jsPDF initialized in portrait A4
                    pdf.addImage(imgData, 'JPEG', 0, 0, config.widthMm, config.heightMm, undefined, 'FAST');
                } else {
                    // Add subsequent pages with appropriate orientation
                    if (config.orientation === 'landscape') {
                        pdf.addPage([297, 210], 'landscape');
                    } else {
                        pdf.addPage([210, 297], 'portrait');
                    }
                    pdf.addImage(imgData, 'JPEG', 0, 0, config.widthMm, config.heightMm, undefined, 'FAST');
                }
            }

            updateProgress(92, 'Compiling 8-page document...');
            await new Promise(r => setTimeout(r, 120));

            // Generate clean filename based on subject and date
            const subjectVal = (document.getElementById('subject-input')?.value || 'BSc_IT').replace(/[^a-zA-Z0-9_-]/g, '_');
            const dateVal = (document.getElementById('date-input')?.value || '2026-09-23').replace(/[^a-zA-Z0-9_-]/g, '_');
            const fileName = `Willingdon_College_${subjectVal}_Exam_Bill_${dateVal}.pdf`;

            updateProgress(98, 'Downloading PDF to your computer...');
            await new Promise(r => setTimeout(r, 80));

            // Save PDF directly to user's PC
            pdf.save(fileName);

            updateProgress(100, 'Download complete!');
            await new Promise(r => setTimeout(r, 400));

            // Show Toast
            showToastNotification('✓ PDF successfully downloaded to your computer!');
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('An error occurred while creating the PDF: ' + err.message);
        } finally {
            document.body.classList.remove('pdf-export-mode');
            if (progressModal) progressModal.style.display = 'none';
            isGeneratingPdf = false;
        }
    };

    // Expose functions globally
    window.openShareModal = openShareModal;
    window.closeShareModal = closeShareModal;
    window.copyShareUrl = copyShareUrl;
    window.shareNative = shareNative;
    window.saveAllBillDataManually = saveAllBillDataManually;
    window.saveAllData = saveAllData;
    window.loadAllData = loadAllData;
    window.clearAllBillData = clearAllBillData;
    window.attemptLogin = attemptLogin;
    window.toggleLoginPassword = toggleLoginPassword;
    window.logout = logout;
    window.printPage = printPage;
    window.checkFormFilledStatus = checkFormFilledStatus;
    window.openDownloadConfirmModal = openDownloadConfirmModal;
    window.closeDownloadConfirmModal = closeDownloadConfirmModal;
    window.focusFirstMissingField = focusFirstMissingField;
    window.handleDownloadPdf = handleDownloadPdf;
    window.startPdfDownload = startPdfDownload;

    // Initial sequence
    assignPermanentFieldKeys();
    checkAuth();
    loadAllData();

    // Login input listeners for dynamic button reveal & 3D state
    const loginUserEl = document.getElementById('login-username');
    const loginPassEl = document.getElementById('login-password');
    if (loginUserEl && loginPassEl) {
        loginUserEl.addEventListener('input', updateLoginButtonState);
        loginPassEl.addEventListener('input', updateLoginButtonState);
        loginUserEl.addEventListener('focus', updateLoginButtonState);
        loginPassEl.addEventListener('focus', updateLoginButtonState);
        loginUserEl.addEventListener('blur', updateLoginButtonState);
        loginPassEl.addEventListener('blur', updateLoginButtonState);
        updateLoginButtonState();
    }

    // Setup Navigation Tabs active state switching and smooth scrolling
    const initNavTabs = () => {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        navTabs.forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // Sync active tab with currently visible page section on scroll
        const pages = document.querySelectorAll('.page');
        if ('IntersectionObserver' in window && pages.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const pageId = entry.target.id;
                        navTabs.forEach(tab => {
                            if (tab.getAttribute('href') === `#${pageId}`) {
                                navTabs.forEach(t => t.classList.remove('active'));
                                tab.classList.add('active');
                            }
                        });
                    }
                });
            }, {
                root: null,
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0
            });

            pages.forEach(p => observer.observe(p));
        }
    };
    initNavTabs();

    setTimeout(() => {
        syncAllDisplays();
        updateTableTotals();
        updateStaffTotals();
        updatePage7Totals();
        updateTadaTotals();
    }, 100);
});
