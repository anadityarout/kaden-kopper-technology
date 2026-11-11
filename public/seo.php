
<?php
header("Content-Type: text/html; charset=UTF-8");

$siteUrl = "https://kadenskoppertechnology.com";
$apiUrl = "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/seo";

/*
 * Map website routes to the page names
 * used in your SEO admin dashboard.
 */
$routes = [
    "/" => "Home",
    "/about" => "About",
    "/service" => "Service",
    "/web-development" => "Web Development",
    "/app-development" => "App Development",
    "/seo" => "SEO",
    "/video-editor" => "Video Editor",
    "/graphic-designer" => "Graphic Designer",
    "/marketing" => "Marketing",
    "/industries" => "Industries",
    "/projects" => "Project",
    "/career" => "Career",
];

$path = parse_url($_SERVER["REQUEST_URI"] ?? "/", PHP_URL_PATH);
$path = "/" . trim($path, "/");

if ($path === "//" || $path === "/") {
    $path = "/";
}

/*
 * Do not serve the React HTML through this
 * SEO handler for API files or static assets.
 */
if (
    preg_match('/\.(js|css|svg|png|jpg|jpeg|webp|ico|xml|txt|json|woff2?)$/i', $path)
) {
    http_response_code(404);
    exit;
}

$pageName = $routes[$path] ?? null;

if (!$pageName) {
    http_response_code(404);
    echo "Page not found";
    exit;
}

/*
 * Fetch the SEO records from Lambda.
 */
$seoRecord = null;

$context = stream_context_create([
    "http" => [
        "method" => "GET",
        "timeout" => 8,
        "header" => "Accept: application/json\r\n",
        "ignore_errors" => true
    ]
]);

$result = @file_get_contents($apiUrl, false, $context);

if ($result !== false) {
    $responseData = json_decode($result, true);

    if (is_array($responseData) && !empty($responseData["seo"])) {
        foreach ($responseData["seo"] as $item) {
            if (
                isset($item["page"]) &&
                strcasecmp(trim($item["page"]), $pageName) === 0
            ) {
                $seoRecord = $item;
                break;
            }
        }
    }
}

/*
 * Default values when no SEO record exists.
 */
$title = $seoRecord["metaTitle"] ?? "Kaden Kopper Technology";
$description = $seoRecord["metaDescription"] ?? "";
$keywords = $seoRecord["metaKeywords"] ?? "";
$canonical = $seoRecord["canonicalUrl"] ?? ($siteUrl . ($path === "/" ? "/" : $path));
$altText = $seoRecord["alternativeText"] ?? "";

function escapeHtml($value) {
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

/*
 * Return the React application's HTML template.
 * PHP inserts metadata into the initial HTML source.
 */
$htmlPath = __DIR__ . "/index.html";

if (!file_exists($htmlPath)) {
    http_response_code(500);
    exit("Website HTML template not found.");
}

$html = file_get_contents($htmlPath);

$metaTags = '
<title>' . escapeHtml($title) . '</title>
<meta name="description" content="' . escapeHtml($description) . '">
<meta name="keywords" content="' . escapeHtml($keywords) . '">
<link rel="canonical" href="' . escapeHtml($canonical) . '">
<meta property="og:title" content="' . escapeHtml($title) . '">
<meta property="og:description" content="' . escapeHtml($description) . '">
<meta property="og:url" content="' . escapeHtml($canonical) . '">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="' . escapeHtml($title) . '">
<meta name="twitter:description" content="' . escapeHtml($description) . '">
';

if ($altText !== "") {
    $metaTags .= '<meta name="seo-alt-text" content="' . escapeHtml($altText) . '">' . "\n";
}

/*
 * Replace the existing title and metadata to avoid
 * duplicate title and description tags.
 */
$html = preg_replace('/<title\b[^>]*>.*?<\/title>/is', '', $html);
$html = preg_replace('/<meta\b[^>]*name=["\']description["\'][^>]*>/i', '', $html);
$html = preg_replace('/<meta\b[^>]*name=["\']keywords["\'][^>]*>/i', '', $html);
$html = preg_replace('/<link\b[^>]*rel=["\']canonical["\'][^>]*>/i', '', $html);
$html = preg_replace('/<meta\b[^>]*property=["\']og:(title|description|url|type)["\'][^>]*>/i', '', $html);
$html = preg_replace('/<meta\b[^>]*name=["\']twitter:(card|title|description)["\'][^>]*>/i', '', $html);

$html = preg_replace('/<\/head>/i', $metaTags . "\n</head>", $html, 1);

echo $html;
?>
