// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.bindEvents();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        localStorage.setItem('theme', theme);
        this.theme = theme;
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.activeePage = 'home';
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleInitialRoute();
    }

    bindEvents() {
        // Navigation links
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });

        // Mobile menu toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
            });
        });
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        document.querySelectorAll(`[data-page="${page}"]`).forEach(link => {
            link.classList.add('active');
        });

        // Update URL
        window.history.pushState({ page }, '', `#${page}`);
        
        // Update page title and meta description
        this.updatePageMeta(page);
        
        this.activePage = page;

        // Handle blog article clicks
        if (page === 'blog' || page === 'home') {
            this.bindBlogEvents();
        }
    }

    updatePageMeta(page) {
        const pageMeta = {
            home: {
                title: 'Convert Images to JPG Online – Free & Fast | JPGConverter',
                description: 'Convert PNG, WEBP, HEIC, GIF, BMP, TIFF to JPG online for free. Fast, secure client-side image conversion with no upload required.'
            },
            about: {
                title: 'About JPGConverter - Professional Image Conversion Tools',
                description: 'Learn about JPGConverter\'s mission to provide secure, fast, and free online image conversion tools for everyone.'
            },
            blog: {
                title: 'Image Conversion Blog - Expert Tips & Guides | JPGConverter',
                description: 'Expert guides on image conversion, file formats, optimization techniques, and best practices for digital image management.'
            },
            contact: {
                title: 'Contact JPGConverter - Get Help & Support',
                description: 'Contact our support team for help with image conversion tools, technical questions, or general inquiries.'
            },
            privacy: {
                title: 'Privacy Policy - JPGConverter',
                description: 'Read our privacy policy to understand how we protect your data and ensure secure image conversion.'
            },
            terms: {
                title: 'Terms of Service - JPGConverter',
                description: 'Review our terms of service for using JPGConverter\'s free online image conversion tools.'
            },
            disclaimer: {
                title: 'Disclaimer - JPGConverter',
                description: 'Important disclaimers and limitations regarding our image conversion services and website content.'
            }
        };

        const meta = pageMeta[page];
        if (meta) {
            document.title = meta.title;
            document.querySelector('meta[name="description"]').setAttribute('content', meta.description);
        }
    }

    handleInitialRoute() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(`${hash}-page`)) {
            this.navigateTo(hash);
        }
    }

    bindBlogEvents() {
        document.querySelectorAll('.blog-card, .featured-blog-card').forEach(card => {
            card.addEventListener('click', () => {
                const articleId = card.dataset.article;
                this.showBlogArticle(articleId);
            });
        });
    }

    showBlogArticle(articleId) {
        // This would normally show a detailed article
        // For now, we'll show an alert with article info
        const articles = {
            1: "How to Convert PNG to JPG Without Losing Quality",
            2: "JPG vs PNG: Which Format Should You Choose?",
            3: "Free Online JPG Conversion Tools Compared",
            4: "How to Compress JPG Images Without Quality Loss",
            5: "What is HEIC and How to Convert It to JPG",
            6: "Step-by-Step Guide to Batch Image Conversion"
        };
        
        const title = articles[articleId];
        if (title) {
            // In a real implementation, this would navigate to a detailed article page
            alert(`Article: ${title}\n\nThis would open the full article in a real implementation.`);
        }
    }
}

// Image Conversion Manager
class ImageConverter {
    constructor() {
        this.supportedFormats = ['image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('upload-area');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
            });
        }

        if (uploadArea) {
            // Drag and drop events
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                this.handleFiles(e.dataTransfer.files);
            });

            // Click to upload
            uploadArea.addEventListener('click', () => {
                fileInput?.click();
            });
        }
    }

    async handleFiles(files) {
        if (!files.length) return;

        const resultsContainer = document.getElementById('results-container');
        const resultsSection = document.getElementById('conversion-results');
        
        if (!resultsContainer || !resultsSection) return;

        // Clear previous results
        resultsContainer.innerHTML = '';
        resultsSection.style.display = 'block';

        for (const file of files) {
            if (this.isValidImageFile(file)) {
                await this.convertToJPG(file, resultsContainer);
            } else {
                this.showError(`Unsupported file format: ${file.name}`, resultsContainer);
            }
        }
    }

    isValidImageFile(file) {
        return file.type.startsWith('image/') && file.type !== 'image/jpeg';
    }

    async convertToJPG(file, container) {
        try {
            const resultItem = this.createResultItem(file);
            container.appendChild(resultItem);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Set canvas dimensions
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                // Draw image on canvas
                ctx.drawImage(img, 0, 0);

                // Convert to JPG
                canvas.toBlob((blob) => {
                    if (blob) {
                        this.updateResultItem(resultItem, blob, file);
                    } else {
                        this.showConversionError(resultItem);
                    }
                }, 'image/jpeg', 0.9);
            };

            img.onerror = () => {
                this.showConversionError(resultItem);
            };

            // Load image
            img.src = URL.createObjectURL(file);
        } catch (error) {
            console.error('Conversion error:', error);
            this.showError(`Failed to convert ${file.name}`, container);
        }
    }

    createResultItem(file) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const originalSize = this.formatFileSize(file.size);
        
        resultItem.innerHTML = `
            <div class="result-info">
                <img class="result-preview" src="${URL.createObjectURL(file)}" alt="Original image">
                <div class="result-details">
                    <h4>${file.name}</h4>
                    <p>Original: ${originalSize} | Converting...</p>
                </div>
            </div>
            <div class="loading"></div>
        `;
        
        return resultItem;
    }

    updateResultItem(resultItem, jpgBlob, originalFile) {
        const jpgSize = this.formatFileSize(jpgBlob.size);
        const originalSize = this.formatFileSize(originalFile.size);
        const compressionRatio = ((1 - jpgBlob.size / originalFile.size) * 100).toFixed(1);

        const details = resultItem.querySelector('.result-details p');
        const loadingSpinner = resultItem.querySelector('.loading');

        if (details) {
            details.textContent = `Original: ${originalSize} → JPG: ${jpgSize} (${compressionRatio}% smaller)`;
        }

        if (loadingSpinner) {
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download JPG';
            
            downloadBtn.addEventListener('click', () => {
                this.downloadFile(jpgBlob, this.getJPGFileName(originalFile.name));
            });

            loadingSpinner.replaceWith(downloadBtn);
        }
    }

    showConversionError(resultItem) {
        const loadingSpinner = resultItem.querySelector('.loading');
        if (loadingSpinner) {
            loadingSpinner.innerHTML = '<span style="color: var(--error-color);">Conversion failed</span>';
        }
    }

    showError(message, container) {
        const errorItem = document.createElement('div');
        errorItem.className = 'result-item';
        errorItem.style.borderColor = 'var(--error-color)';
        errorItem.innerHTML = `
            <div class="result-info">
                <i class="fas fa-exclamation-triangle" style="color: var(--error-color); font-size: 2rem;"></i>
                <div class="result-details">
                    <h4>Error</h4>
                    <p>${message}</p>
                </div>
            </div>
        `;
        container.appendChild(errorItem);
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getJPGFileName(originalName) {
        const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        return `${baseName}.jpg`;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Blog Content Manager with full articles
class BlogManager {
    constructor() {
        this.articles = {
            1: {
                title: "How to Convert PNG to JPG Without Losing Quality",
                content: this.getArticle1Content(),
                metaTitle: "Convert PNG to JPG Without Quality Loss - Complete Guide",
                metaDescription: "Learn professional techniques to convert PNG images to JPG format while maintaining optimal quality. Step-by-step guide with best practices.",
                readTime: "5 min read"
            },
            2: {
                title: "JPG vs PNG: Which Format Should You Choose?",
                content: this.getArticle2Content(),
                metaTitle: "JPG vs PNG Format Comparison - When to Use Each",
                metaDescription: "Complete comparison of JPG and PNG image formats. Learn when to use each format for optimal results in web, print, and digital media.",
                readTime: "7 min read"
            }
            // Additional articles would be added here
        };
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.blog-card')) {
                const card = e.target.closest('.blog-card');
                const articleId = card.dataset.article;
                this.showFullArticle(articleId);
            }
        });
    }

    showFullArticle(articleId) {
        const article = this.articles[articleId];
        if (!article) return;

        // Create article overlay
        const overlay = document.createElement('div');
        overlay.className = 'article-overlay';
        overlay.innerHTML = `
            <div class="article-modal">
                <div class="article-header">
                    <h1>${article.title}</h1>
                    <button class="close-article" aria-label="Close article">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="article-content">
                    ${article.content}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Close functionality
        overlay.querySelector('.close-article').addEventListener('click', () => {
            this.closeArticle(overlay);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeArticle(overlay);
            }
        });

        // ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeArticle(overlay);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    closeArticle(overlay) {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
    }

    getArticle1Content() {
        return `
            <div class="article-body">
                <img src="https://pixabay.com/get/gfec0881ebaf218228920629b6cd151d714c7fed189fa6d908d750e29ff12587375e67a8fb5f339ce5e0481b643666cdb6342f9e07a3f76cd2f4bdd6ad89a3248_1280.jpg" alt="PNG to JPG conversion process" class="article-image">
                
                <p>Converting PNG images to JPG format is one of the most common image conversion tasks in digital media. While both formats serve important purposes, understanding how to convert between them while maintaining quality is crucial for photographers, web developers, and content creators.</p>

                <h2>Understanding the Difference Between PNG and JPG</h2>
                <p>Before diving into conversion techniques, it's essential to understand what makes these formats different:</p>
                
                <h3>PNG Format Characteristics</h3>
                <ul>
                    <li><strong>Lossless compression:</strong> PNG maintains original image quality without data loss</li>
                    <li><strong>Transparency support:</strong> PNG files can have transparent backgrounds</li>
                    <li><strong>Larger file sizes:</strong> Due to lossless compression, PNG files are typically larger</li>
                    <li><strong>Best for:</strong> Graphics with sharp edges, logos, screenshots, and images requiring transparency</li>
                </ul>

                <h3>JPG Format Characteristics</h3>
                <ul>
                    <li><strong>Lossy compression:</strong> JPG reduces file size by removing some image data</li>
                    <li><strong>No transparency:</strong> JPG format doesn't support transparent backgrounds</li>
                    <li><strong>Smaller file sizes:</strong> Efficient compression makes JPG ideal for web use</li>
                    <li><strong>Best for:</strong> Photographs, images with gradual color transitions, web optimization</li>
                </ul>

                <h2>Step-by-Step PNG to JPG Conversion Guide</h2>
                
                <h3>Method 1: Using Online Converters</h3>
                <p>Online conversion tools like JPGConverter offer the simplest approach:</p>
                <ol>
                    <li><strong>Select your PNG file:</strong> Drag and drop or browse to select your PNG image</li>
                    <li><strong>Choose quality settings:</strong> Most tools allow you to adjust JPG quality (recommended: 85-95%)</li>
                    <li><strong>Convert and download:</strong> Process the conversion and download your JPG file</li>
                </ol>

                <h3>Method 2: Using Image Editing Software</h3>
                <p>Professional software provides more control over the conversion process:</p>
                <ol>
                    <li><strong>Open your PNG file</strong> in software like Photoshop, GIMP, or Paint.NET</li>
                    <li><strong>Adjust image settings</strong> if needed (color correction, resizing)</li>
                    <li><strong>Export as JPG</strong> using "Save As" or "Export" function</li>
                    <li><strong>Configure quality settings</strong> to balance file size and image quality</li>
                </ol>

                <h2>Quality Preservation Techniques</h2>

                <h3>Optimal Quality Settings</h3>
                <p>The key to maintaining quality during PNG to JPG conversion lies in choosing the right compression settings:</p>
                <ul>
                    <li><strong>High quality (90-100%):</strong> Minimal compression, larger files, best for print</li>
                    <li><strong>Medium-high quality (80-90%):</strong> Good balance for most uses</li>
                    <li><strong>Medium quality (70-80%):</strong> Suitable for web use with noticeable compression</li>
                    <li><strong>Lower quality (50-70%):</strong> Small files but visible quality loss</li>
                </ul>

                <h3>Handling Transparency</h3>
                <p>Since JPG doesn't support transparency, you'll need to decide how to handle transparent areas:</p>
                <ul>
                    <li><strong>White background:</strong> Most common default, works well for most images</li>
                    <li><strong>Custom background color:</strong> Choose a color that complements your image</li>
                    <li><strong>Remove transparency carefully:</strong> Use content-aware fill or manual editing</li>
                </ul>

                <h2>Best Practices for Quality Conversion</h2>

                <h3>Pre-Conversion Optimization</h3>
                <ul>
                    <li><strong>Check image resolution:</strong> Ensure you're working with the highest quality source</li>
                    <li><strong>Color profile management:</strong> Use sRGB color profile for web compatibility</li>
                    <li><strong>Noise reduction:</strong> Clean up any noise or artifacts before conversion</li>
                </ul>

                <h3>Batch Conversion Tips</h3>
                <p>When converting multiple PNG files:</p>
                <ul>
                    <li><strong>Use consistent settings:</strong> Apply the same quality settings across similar images</li>
                    <li><strong>Test with sample images:</strong> Convert a few test images to verify settings</li>
                    <li><strong>Organize output files:</strong> Create a clear folder structure for converted images</li>
                </ul>

                <h2>Common Conversion Mistakes to Avoid</h2>

                <h3>Quality-Related Errors</h3>
                <ul>
                    <li><strong>Over-compression:</strong> Using quality settings below 70% for important images</li>
                    <li><strong>Ignoring color profiles:</strong> Not considering how colors will appear across devices</li>
                    <li><strong>Multiple conversions:</strong> Converting from JPG to PNG and back to JPG repeatedly</li>
                </ul>

                <h3>Technical Mistakes</h3>
                <ul>
                    <li><strong>Wrong dimensions:</strong> Accidentally resizing during conversion</li>
                    <li><strong>Metadata loss:</strong> Not preserving important EXIF data when needed</li>
                    <li><strong>Inappropriate format choice:</strong> Converting images that should remain PNG</li>
                </ul>

                <h2>When NOT to Convert PNG to JPG</h2>
                <p>Some images are better left as PNG:</p>
                <ul>
                    <li><strong>Images with transparency:</strong> If transparency is essential for your use case</li>
                    <li><strong>Simple graphics:</strong> Logos, icons, and graphics with few colors</li>
                    <li><strong>Images with sharp edges:</strong> Screenshots, diagrams, and technical illustrations</li>
                    <li><strong>Images requiring lossless quality:</strong> Medical images, technical documentation</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Converting PNG to JPG without losing quality requires understanding both formats' strengths and choosing appropriate conversion settings. By following the techniques outlined in this guide, you can achieve optimal results for your specific needs while maintaining visual quality and optimizing file sizes.</p>

                <p>Remember that the best conversion approach depends on your intended use case. For web optimization, slightly higher compression may be acceptable, while print materials require maximum quality preservation. Always test your conversion settings with sample images before processing large batches.</p>
            </div>
        `;
    }

    getArticle2Content() {
        return `
            <div class="article-body">
                <img src="https://pixabay.com/get/g9f930dd03b86dac76a17127f54cbbc5cf3938cc192be17612eda19a0a39c3ee4b08e44a6f505ef071c535fa961d0bf67b7b4c93876a3fad0827ed1adad77d787_1280.jpg" alt="JPG vs PNG file format comparison" class="article-image">
                
                <p>Choosing between JPG and PNG formats is one of the most fundamental decisions in digital image management. Each format serves distinct purposes and excels in different scenarios. Understanding their strengths and limitations will help you make informed decisions for your projects.</p>

                <h2>Technical Overview: How Each Format Works</h2>

                <h3>JPG (JPEG) Format Deep Dive</h3>
                <p>JPG, or JPEG (Joint Photographic Experts Group), uses lossy compression algorithms that analyze image data and remove information deemed less important to human perception:</p>
                <ul>
                    <li><strong>Compression method:</strong> Discrete Cosine Transform (DCT) breaks images into frequency components</li>
                    <li><strong>Color sampling:</strong> Reduces color information more than brightness information</li>
                    <li><strong>Block-based processing:</strong> Processes images in 8x8 pixel blocks</li>
                    <li><strong>Quantization:</strong> Removes fine details to achieve compression</li>
                </ul>

                <h3>PNG Format Deep Dive</h3>
                <p>PNG (Portable Network Graphics) uses lossless compression, preserving every pixel of original image data:</p>
                <ul>
                    <li><strong>Compression method:</strong> DEFLATE algorithm similar to ZIP compression</li>
                    <li><strong>Prediction filters:</strong> Analyzes pixel relationships to improve compression</li>
                    <li><strong>Transparency support:</strong> Alpha channel allows for variable transparency</li>
                    <li><strong>Palette optimization:</strong> Can use indexed color for smaller files</li>
                </ul>

                <h2>Detailed Format Comparison</h2>

                <h3>File Size and Compression</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: var(--bg-secondary);">
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Aspect</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">JPG</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">PNG</th>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid var(--border-color);"><strong>Compression</strong></td>
                        <td style="padding: 12px; border: 1px solid var(--border-color);">Lossy (discards data)</td>
                        <td style="padding: 12px; border: 1px solid var(--border-color);">Lossless (preserves all data)</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid var(--border-color);"><strong>File Size</strong></td>
                        <td style="padding: 12px; border: 1px solid var(--border-color);">Smaller (10-50% of PNG)</td>
                        <td style="padding: 12px; border: 1px solid var(--border-color);">Larger (2-10x JPG size)</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid var(--border-color);"><strong>Quality Loss</strong></td>
                        <td style="padding: 12px; border: 1px solid var(--border-color);">Yes (configurable)</td>
                        <td style="padding: 12px; border: 1px solid var(--border-color);">None</td>
                    </tr>
                </table>

                <h3>Image Quality Characteristics</h3>
                <ul>
                    <li><strong>JPG strengths:</strong> Excellent for photographs with smooth color gradients, natural scenes, and complex images with many colors</li>
                    <li><strong>JPG weaknesses:</strong> Visible artifacts in high-contrast areas, loss of fine details, degradation with repeated editing</li>
                    <li><strong>PNG strengths:</strong> Perfect for sharp edges, text, simple graphics, images requiring transparency</li>
                    <li><strong>PNG weaknesses:</strong> Inefficient for complex photographs, larger file sizes</li>
                </ul>

                <h2>Use Case Scenarios: When to Choose Each Format</h2>

                <h3>Choose JPG For:</h3>
                <h4>Photography and Natural Images</h4>
                <ul>
                    <li><strong>Digital photography:</strong> Portraits, landscapes, event photography</li>
                    <li><strong>Web images:</strong> Blog photos, social media content, e-commerce product shots</li>
                    <li><strong>Email attachments:</strong> When file size matters more than perfect quality</li>
                    <li><strong>Mobile apps:</strong> Reducing app size and improving load times</li>
                </ul>

                <h4>E-commerce and Marketing</h4>
                <ul>
                    <li><strong>Product catalogs:</strong> Balancing quality with fast page loading</li>
                    <li><strong>Marketing materials:</strong> Digital advertisements, promotional images</li>
                    <li><strong>Social media:</strong> Most platforms optimize for JPG anyway</li>
                </ul>

                <h3>Choose PNG For:</h3>
                <h4>Graphics and Design Elements</h4>
                <ul>
                    <li><strong>Logos and branding:</strong> Company logos, brand marks, icon sets</li>
                    <li><strong>User interface elements:</strong> Buttons, icons, navigation elements</li>
                    <li><strong>Infographics:</strong> Charts, diagrams, data visualizations</li>
                    <li><strong>Digital artwork:</strong> Illustrations with sharp lines and flat colors</li>
                </ul>

                <h4>Technical and Professional Use</h4>
                <ul>
                    <li><strong>Screenshots:</strong> Software documentation, tutorials, technical guides</li>
                    <li><strong>Print graphics:</strong> When maximum quality is required</li>
                    <li><strong>Transparency needs:</strong> Overlays, watermarks, layered designs</li>
                    <li><strong>Image editing:</strong> Working files that need repeated editing</li>
                </ul>

                <h2>Performance Considerations</h2>

                <h3>Web Performance Impact</h3>
                <p>Format choice significantly affects website performance:</p>
                <ul>
                    <li><strong>Page load speed:</strong> JPG images load 3-5x faster than equivalent PNG images</li>
                    <li><strong>Bandwidth usage:</strong> Smaller JPG files reduce data consumption</li>
                    <li><strong>Mobile experience:</strong> Faster loading improves user experience on slower connections</li>
                    <li><strong>SEO benefits:</strong> Google considers page speed in search rankings</li>
                </ul>

                <h3>Storage and Bandwidth</h3>
                <ul>
                    <li><strong>Server costs:</strong> Smaller JPG files reduce storage and CDN costs</li>
                    <li><strong>Backup efficiency:</strong> JPG files backup faster and require less storage space</li>
                    <li><strong>Cloud storage:</strong> Significant savings when storing thousands of images</li>
                </ul>

                <h2>Quality vs File Size Trade-offs</h2>

                <h3>JPG Quality Settings Guide</h3>
                <ul>
                    <li><strong>95-100% quality:</strong> Near-lossless, large files, ideal for print</li>
                    <li><strong>85-94% quality:</strong> Excellent quality, good balance for professional use</li>
                    <li><strong>75-84% quality:</strong> Good quality, standard for web use</li>
                    <li><strong>65-74% quality:</strong> Acceptable quality, visible compression in detailed areas</li>
                    <li><strong>Below 65% quality:</strong> Poor quality, suitable only for thumbnails</li>
                </ul>

                <h3>PNG Optimization Strategies</h3>
                <ul>
                    <li><strong>Color depth reduction:</strong> Use 8-bit PNG when 24-bit isn't necessary</li>
                    <li><strong>Palette optimization:</strong> Reduce color count for simpler images</li>
                    <li><strong>Transparency optimization:</strong> Remove unnecessary alpha channels</li>
                    <li><strong>Compression tools:</strong> Use tools like TinyPNG or OptiPNG</li>
                </ul>

                <h2>Modern Format Alternatives</h2>

                <h3>WebP: The Modern Compromise</h3>
                <p>WebP offers advantages of both formats:</p>
                <ul>
                    <li><strong>Superior compression:</strong> 25-35% smaller than JPG, 26% smaller than PNG</li>
                    <li><strong>Lossless and lossy:</strong> Supports both compression types</li>
                    <li><strong>Transparency support:</strong> Alpha channel like PNG</li>
                    <li><strong>Browser support:</strong> Widely supported in modern browsers</li>
                </ul>

                <h3>AVIF: Next-Generation Format</h3>
                <ul>
                    <li><strong>Exceptional compression:</strong> Up to 50% smaller than JPG</li>
                    <li><strong>High quality:</strong> Better quality at smaller sizes</li>
                    <li><strong>Modern features:</strong> HDR support, wide color gamuts</li>
                    <li><strong>Limited support:</strong> Still gaining browser adoption</li>
                </ul>

                <h2>Decision Framework</h2>

                <h3>Quick Decision Tree</h3>
                <p>Use this framework to make format decisions:</p>
                <ol>
                    <li><strong>Does the image need transparency?</strong> If yes → PNG</li>
                    <li><strong>Is it a photograph or complex image?</strong> If yes → JPG</li>
                    <li><strong>Does it have sharp edges or text?</strong> If yes → PNG</li>
                    <li><strong>Is file size critical?</strong> If yes → JPG</li>
                    <li><strong>Will the image be edited repeatedly?</strong> If yes → PNG</li>
                    <li><strong>Is it for web use with many visitors?</strong> If yes → JPG</li>
                </ol>

                <h2>Future-Proofing Your Format Choices</h2>

                <h3>Progressive Enhancement Strategy</h3>
                <ul>
                    <li><strong>Serve modern formats:</strong> Use WebP/AVIF with JPG/PNG fallbacks</li>
                    <li><strong>Responsive images:</strong> Different formats for different devices</li>
                    <li><strong>Conditional loading:</strong> Serve appropriate format based on browser support</li>
                    <li><strong>Regular optimization:</strong> Periodically review and update format choices</li>
                </ul>

                <h2>Conclusion: Making the Right Choice</h2>
                <p>The choice between JPG and PNG isn't about one being universally better than the other—it's about selecting the right tool for each specific job. JPG excels at compressing photographic content efficiently while maintaining acceptable quality, making it ideal for web use and general photography. PNG shines when image quality, transparency, or sharp edges are paramount.</p>

                <p>As the web evolves, newer formats like WebP and AVIF offer compelling alternatives that combine the best features of both traditional formats. However, JPG and PNG remain foundational formats that will continue to serve important roles in digital imaging for years to come.</p>

                <p>Consider your specific requirements: audience, technical constraints, quality needs, and performance goals. With this understanding, you can confidently choose the format that best serves your project's needs while providing the optimal balance of quality, performance, and compatibility.</p>
            </div>
        `;
    }
}

// Contact Form Manager
class ContactFormManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> Sending...';
        submitBtn.disabled = true;

        try {
            // In a real implementation, this would submit to Formspree
            // For demo purposes, we'll simulate the submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showSuccessMessage(form);
            form.reset();
        } catch (error) {
            this.showErrorMessage(form);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage(form) {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Thank you for your message! We'll get back to you within 24 hours.</p>
        `;
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showErrorMessage(form) {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>Sorry, there was an error sending your message. Please try again or contact us directly at support@jpgconverter.com.</p>
        `;
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// SEO and Analytics Manager
class SEOManager {
    constructor() {
        this.init();
    }

    init() {
        this.generateStructuredData();
        this.handleInternalLinking();
    }

    generateStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "JPGConverter",
            "url": "https://jpgconverter.com",
            "description": "Free online image converter to convert PNG, WEBP, HEIC, GIF, BMP, TIFF to JPG format",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web Browser",
            "permissions": "none",
            "isAccessibleForFree": true,
            "creator": {
                "@type": "Organization",
                "name": "JPGConverter"
            },
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    handleInternalLinking() {
        // Add rel="nofollow" to external links
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.href.includes('jpgconverter.com')) {
                link.setAttribute('rel', 'nofollow noopener');
                link.setAttribute('target', '_blank');
            }
        });

        // Add proper alt text to images
        document.querySelectorAll('img:not([alt])').forEach(img => {
            img.setAttribute('alt', 'JPGConverter - Image conversion tool');
        });
    }
}

// Main Application Initialization
class JPGConverterApp {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialize all components
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.imageConverter = new ImageConverter();
        this.blogManager = new BlogManager();
        this.contactFormManager = new ContactFormManager();
        this.seoManager = new SEOManager();

        // Add additional CSS for article modal
        this.addModalStyles();
        
        // Add form message styles
        this.addFormStyles();

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigationManager.navigateTo(e.state.page);
            }
        });

        console.log('JPGConverter application initialized successfully');
    }

    addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .article-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: var(--spacing-md);
            }

            .article-modal {
                background: var(--bg-color);
                border-radius: var(--border-radius-lg);
                max-width: 800px;
                max-height: 90vh;
                width: 100%;
                overflow: hidden;
                box-shadow: var(--shadow-lg);
            }

            .article-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-lg);
                border-bottom: 1px solid var(--border-color);
                background: var(--bg-secondary);
            }

            .article-header h1 {
                margin: 0;
                font-size: var(--font-size-2xl);
                color: var(--text-primary);
            }

            .close-article {
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                color: var(--text-secondary);
                cursor: pointer;
                padding: var(--spacing-sm);
                border-radius: var(--border-radius);
                transition: var(--transition);
            }

            .close-article:hover {
                background: var(--bg-tertiary);
                color: var(--text-primary);
            }

            .article-content {
                padding: var(--spacing-lg);
                overflow-y: auto;
                max-height: calc(90vh - 100px);
            }

            .article-body {
                line-height: 1.7;
            }

            .article-body h2 {
                color: var(--text-primary);
                margin-top: var(--spacing-xl);
                margin-bottom: var(--spacing-md);
                font-size: var(--font-size-xl);
            }

            .article-body h3 {
                color: var(--text-primary);
                margin-top: var(--spacing-lg);
                margin-bottom: var(--spacing-sm);
                font-size: var(--font-size-lg);
            }

            .article-body h4 {
                color: var(--text-primary);
                margin-top: var(--spacing-md);
                margin-bottom: var(--spacing-sm);
                font-size: var(--font-size-base);
                font-weight: 600;
            }

            .article-body p {
                margin-bottom: var(--spacing-md);
                color: var(--text-secondary);
            }

            .article-body ul, .article-body ol {
                margin-bottom: var(--spacing-md);
                padding-left: var(--spacing-xl);
            }

            .article-body li {
                margin-bottom: var(--spacing-sm);
                color: var(--text-secondary);
            }

            .article-image {
                width: 100%;
                border-radius: var(--border-radius);
                margin: var(--spacing-lg) 0;
            }

            .article-body table {
                width: 100%;
                border-collapse: collapse;
                margin: var(--spacing-lg) 0;
            }

            .article-body th, .article-body td {
                padding: var(--spacing-md);
                border: 1px solid var(--border-color);
                text-align: left;
            }

            .article-body th {
                background: var(--bg-secondary);
                font-weight: 600;
                color: var(--text-primary);
            }

            .article-body td {
                color: var(--text-secondary);
            }

            @media (max-width: 768px) {
                .article-modal {
                    margin: var(--spacing-sm);
                    max-height: 95vh;
                }

                .article-header {
                    padding: var(--spacing-md);
                }

                .article-header h1 {
                    font-size: var(--font-size-xl);
                }

                .article-content {
                    padding: var(--spacing-md);
                }
            }
        `;
        document.head.appendChild(style);
    }

    addFormStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .form-message {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-md);
                border-radius: var(--border-radius);
                margin-top: var(--spacing-md);
            }

            .form-message.success {
                background: #d1fae5;
                color: #065f46;
                border: 1px solid #10b981;
            }

            .form-message.error {
                background: #fee2e2;
                color: #991b1b;
                border: 1px solid #ef4444;
            }

            .form-message i {
                font-size: var(--font-size-lg);
            }

            .form-message p {
                margin: 0;
                color: inherit;
            }

            [data-theme="dark"] .form-message.success {
                background: #064e3b;
                color: #6ee7b7;
            }

            [data-theme="dark"] .form-message.error {
                background: #7f1d1d;
                color: #fca5a5;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application
const app = new JPGConverterApp();
